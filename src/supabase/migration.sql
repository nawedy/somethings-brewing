-- SUPABASE SQL SCHEMA FOR SOMETHING'S BREWING

-- PRODUCTS TABLE
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  price numeric(10, 2) not null,
  stock integer default 0,
  available boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- BLOG POSTS TABLE
create table blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  published boolean default false,
  published_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- CUSTOMERS TABLE
create table customers (
  id uuid primary key,
  email text unique not null,
  full_name text,
  phone text,
  is_affiliate boolean default false,
  role text default 'customer',
  last_login_at timestamp with time zone,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AFFILIATES TABLE
create table affiliates (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  referral_code text unique not null,
  earnings numeric(10, 2) default 0.00,
  created_at timestamp with time zone default now()
);

-- ORDERS TABLE
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  affiliate_id uuid references affiliates(id),
  total_price numeric(10, 2) not null,
  status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ORDER ITEMS TABLE
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null,
  unit_price numeric(10, 2) not null
);

-- SALES LOG TABLE
create table sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  affiliate_id uuid references affiliates(id),
  quantity integer not null,
  sale_price numeric(10, 2) not null,
  sale_date timestamp with time zone default now()
);

-- PRICING LOG TABLE
create table pricing_log (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  old_price numeric(10, 2),
  new_price numeric(10, 2),
  changed_at timestamp with time zone default now()
);

-- NEWSLETTER SUBSCRIPTIONS
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamp with time zone default now()
);

-- PRODUCT SUBSCRIPTIONS (e.g., auto-reorder)
create table product_subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  frequency text not null, -- weekly, monthly, etc.
  next_delivery date,
  last_delivery date,
  subscription_start_date date,
  subscription_end_date date,
  quantity integer default 1,
  subscription_active boolean default true,
  first_name text,
  last_name text,
  delivery_address text,
  email text,
  mobile text,
  email_opt_in boolean default true,
  sms_opt_in boolean default false,
  created_at timestamp with time zone default now()
);


-- ANALYTICS EVENT LOG
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references customers(id),
  event_type text not null,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- BREW QUIZ RESULTS TABLE
create table brew_quiz_results (
  id uuid primary key default gen_random_uuid(),
  answers text[] not null,
  result text not null,
  created_at timestamp with time zone default now(),
  customer_id uuid references customers(id) on delete set null
);

-- BREW QUIZ CONVERSIONS TABLE
create table brew_quiz_conversions (
  id uuid primary key default gen_random_uuid(),
  quiz_result_id uuid references brew_quiz_results(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  action text not null check (action in ('view', 'add_to_cart', 'purchase')),
  created_at timestamp with time zone default now()
);

-- EMAIL LOGS TABLE
create table email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text not null,
  body text not null,
  status text default 'pending', -- 'pending', 'sent', 'failed'
  attempts integer default 0,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- INDEXING
create index on products (slug);
create index on products (available);
create index on blogs (slug);
create index on orders (customer_id);
create index on orders (affiliate_id);
create index on order_items (order_id);
create index on order_items (product_id);
create index on sales (product_id);
create index on sales (affiliate_id);
create index on pricing_log (product_id);
create index on analytics_events (event_type);
create index on product_subscriptions (customer_id, product_id);
create index on affiliates (referral_code);
create index on brew_quiz_results (created_at);
create index on brew_quiz_results (result);
create index on brew_quiz_results (customer_id);
create index on brew_quiz_conversions (quiz_result_id);
create index on brew_quiz_conversions (product_id);
create index on brew_quiz_conversions (created_at);
create index on email_logs (recipient);
create index on email_logs (status);
create index on email_logs (created_at);

-- ROW LEVEL SECURITY POLICIES
alter table brew_quiz_results enable row level security;
alter table brew_quiz_conversions enable row level security;
alter table email_logs enable row level security;

-- Admin-only policies for quiz tables
create policy "Admins only - select & insert on quiz results"
on brew_quiz_results
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);

create policy "Admins only - select & insert on quiz conversions"
on brew_quiz_conversions
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);

-- Admin-only policies for email logs
create policy "Admins only - insert/select email logs"
on email_logs
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);

-- EMAIL NOTIFICATION FUNCTION AND TRIGGER
create extension if not exists pg_net with schema extensions;

create or replace function email_logs_notify()
returns trigger
language plpgsql
security definer
as $$
declare
  req_headers json;
  payload json;
begin
  -- Prepare the SendGrid request
  req_headers := json_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || current_setting('custom.sendgrid_api_key', true)
  );

  payload := json_build_object(
    'personalizations', json_build_array(json_build_object('to', json_build_array(json_build_object('email', NEW.recipient)))),
    'from', json_build_object('email', 'no-reply@somethingsbrewing.com'),
    'subject', NEW.subject,
    'content', json_build_array(json_build_object('type', 'text/plain', 'value', NEW.body))
  );

  -- Make the HTTP request
  perform net.http_post(
    url := 'https://api.sendgrid.com/v3/mail/send',
    headers := req_headers,
    body := payload::text
  );

  -- Mark email as sent
  update email_logs
  set status = 'sent', sent_at = now()
  where id = NEW.id;

  return null;
end;
$$;

create trigger on_email_log_insert
after insert on email_logs
for each row
execute function email_logs_notify();

-- ADMIN ROLE MANAGEMENT FUNCTION
create or replace function set_admin_role(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Ensure only admins can run this function
  if not exists (
    select 1 from public.customers
    where id = auth.uid()
    and role = 'admin'
  ) then
    raise exception 'Only admins can assign admin role';
  end if;

  -- Update role of target user
  update public.customers
  set role = 'admin'
  where id = target_user_id;
end;
$$;

grant execute on function set_admin_role(uuid) to authenticated;

-- STOCK MANAGEMENT FUNCTIONS
create or replace function decrement_product_stock(p_id uuid, qty integer)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = greatest(stock - qty, 0), updated_at = now()
  where id = p_id and stock is not null;
end;
$$;

create or replace function increment_product_stock(p_id uuid, qty integer)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = stock + qty, updated_at = now()
  where id = p_id and stock is not null;
end;
$$;
