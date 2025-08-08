-- File: src/supabase/order_tracking_migration.sql
-- Additional database schema for order tracking system

-- Add tracking fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS shipping_carrier text,
ADD COLUMN IF NOT EXISTS shipping_address jsonb,
ADD COLUMN IF NOT EXISTS estimated_delivery timestamp with time zone;

-- Create order tracking table
CREATE TABLE IF NOT EXISTS order_tracking (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  status text not null check (status in (
    'pending',
    'paid', 
    'processing',
    'shipped',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'payment_failed',
    'refunded'
  )),
  notes text,
  tracking_number text,
  shipping_carrier text,
  location text,
  created_at timestamp with time zone default now()
);

-- Create inventory tracking table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  quantity_available integer not null default 0,
  quantity_reserved integer not null default 0,
  quantity_sold integer not null default 0,
  reorder_point integer default 10,
  last_restocked timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order status change notifications table
CREATE TABLE IF NOT EXISTS order_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  notification_type text not null check (notification_type in (
    'order_confirmed',
    'payment_received',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  )),
  message text not null,
  sent boolean default false,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_status ON order_tracking(status);
CREATE INDEX IF NOT EXISTS idx_order_tracking_created_at ON order_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_order_id ON order_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_customer_id ON order_notifications(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_notifications_sent ON order_notifications(sent);

-- Enable RLS on new tables
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_tracking
CREATE POLICY "Customers can view their order tracking"
ON order_tracking FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_tracking.order_id
    AND orders.customer_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all order tracking"
ON order_tracking FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.customers
    WHERE customers.id = auth.uid()
    AND customers.role = 'admin'
  )
);

-- RLS Policies for inventory
CREATE POLICY "Customers can view inventory for available products"
ON inventory FOR SELECT
USING (quantity_available > 0);

CREATE POLICY "Admins can manage all inventory"
ON inventory FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.customers
    WHERE customers.id = auth.uid()
    AND customers.role = 'admin'
  )
);

-- RLS Policies for order_notifications
CREATE POLICY "Customers can view their notifications"
ON order_notifications FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
ON order_notifications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.customers
    WHERE customers.id = auth.uid()
    AND customers.role = 'admin'
  )
);

-- Function to update inventory when order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Reserve inventory for paid orders
  IF NEW.status = 'paid' AND OLD.status = 'pending' THEN
    -- Update inventory for each item in the order
    UPDATE inventory 
    SET 
      quantity_reserved = quantity_reserved + order_items.quantity,
      updated_at = now()
    FROM order_items 
    WHERE inventory.product_id = order_items.product_id 
    AND order_items.order_id = NEW.id;
  END IF;

  -- Commit inventory for shipped orders
  IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
    UPDATE inventory 
    SET 
      quantity_available = quantity_available - order_items.quantity,
      quantity_reserved = quantity_reserved - order_items.quantity,
      quantity_sold = quantity_sold + order_items.quantity,
      updated_at = now()
    FROM order_items 
    WHERE inventory.product_id = order_items.product_id 
    AND order_items.order_id = NEW.id;
  END IF;

  -- Release reserved inventory for cancelled orders
  IF NEW.status = 'cancelled' AND OLD.status IN ('paid', 'processing') THEN
    UPDATE inventory 
    SET 
      quantity_reserved = quantity_reserved - order_items.quantity,
      updated_at = now()
    FROM order_items 
    WHERE inventory.product_id = order_items.product_id 
    AND order_items.order_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory updates
CREATE TRIGGER order_status_inventory_update
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_order();

-- Function to create order notification
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_message text;
  notification_type_val text;
BEGIN
  -- Determine notification type and message based on status
  CASE NEW.status
    WHEN 'paid' THEN
      notification_type_val := 'payment_received';
      notification_message := 'Your payment has been received and your order is being processed.';
    WHEN 'processing' THEN
      notification_type_val := 'processing';
      notification_message := 'Your order is being prepared for shipment.';
    WHEN 'shipped' THEN
      notification_type_val := 'shipped';
      notification_message := 'Your order has been shipped and is on its way to you.';
    WHEN 'delivered' THEN
      notification_type_val := 'delivered';
      notification_message := 'Your order has been delivered. Thank you for your purchase!';
    WHEN 'cancelled' THEN
      notification_type_val := 'cancelled';
      notification_message := 'Your order has been cancelled. If you have any questions, please contact support.';
    ELSE
      RETURN NEW; -- Don't create notification for other statuses
  END CASE;

  -- Insert notification
  INSERT INTO order_notifications (
    order_id,
    customer_id,
    notification_type,
    message
  ) VALUES (
    NEW.id,
    NEW.customer_id,
    notification_type_val,
    notification_message
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order notifications
CREATE TRIGGER order_status_notification
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION create_order_notification();

-- Function to get order status timeline
CREATE OR REPLACE FUNCTION get_order_timeline(order_uuid uuid)
RETURNS TABLE (
  status text,
  created_at timestamp with time zone,
  notes text,
  tracking_number text,
  shipping_carrier text,
  location text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ot.status,
    ot.created_at,
    ot.notes,
    ot.tracking_number,
    ot.shipping_carrier,
    ot.location
  FROM order_tracking ot
  WHERE ot.order_id = order_uuid
  ORDER BY ot.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert initial inventory records for existing products
INSERT INTO inventory (product_id, quantity_available)
SELECT id, 100 -- Default stock level
FROM products
WHERE id NOT IN (SELECT product_id FROM inventory)
ON CONFLICT DO NOTHING;
