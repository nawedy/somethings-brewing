// File: src/routes/api/webhooks/stripe/+server.js
// Stripe webhook handler for processing payment events

import { json } from '@sveltejs/kit';
import { verifyWebhookSignature, handleWebhookEvent } from '$lib/stripe-server.js';
import { supabase } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		// Get raw payload and signature
		const payload = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			console.error('Missing Stripe signature header');
			return json({ error: 'Missing signature' }, { status: 400 });
		}

		// Verify webhook signature
		const { verified, event, error } = verifyWebhookSignature(payload, signature);

		if (!verified) {
			console.error('Webhook signature verification failed:', error);
			return json({ error: 'Invalid signature' }, { status: 400 });
		}

		// Log webhook event
		console.log(`Processing webhook event: ${event.type}`);

		// Handle specific webhook events
    switch (event.type) {
			case 'payment_intent.succeeded':
				await handleSuccessfulPayment(event.data.object);
				break;

			case 'payment_intent.payment_failed':
				await handleFailedPayment(event.data.object);
				break;

			case 'customer.created':
				await handleCustomerCreated(event.data.object);
				break;

			case 'invoice.payment_succeeded':
				await handleSubscriptionPayment(event.data.object);
				break;

			case 'checkout.session.completed':
				await handleCheckoutCompleted(event.data.object);
				break;

      case 'payment_intent.canceled':
      case 'payment_intent.requires_payment_method':
        await handleFailedPayment(event.data.object);
        break;

      default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		// Process with general webhook handler
		await handleWebhookEvent(event);

		return json({ received: true });
	} catch (error) {
		console.error('Webhook processing error:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
}

// Handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
	try {
		const { id, amount, currency, metadata } = paymentIntent;

		// Update order status in database
		if (metadata.order_id) {
			const { error } = await supabase
				.from('orders')
				.update({
					status: 'paid',
					updated_at: new Date().toISOString()
				})
				.eq('id', metadata.order_id);

			if (error) {
				console.error('Error updating order status:', error);
			} else {
				console.log(`Order ${metadata.order_id} marked as paid`);
			}
		}

    // Log successful payment
		console.log(`Payment succeeded: ${id}, Amount: ${amount / 100} ${currency.toUpperCase()}`);

    // Update inventory: ensure stock reflects paid order
    if (metadata.order_id) {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', metadata.order_id);
      if (items) {
        for (const it of items) {
          // already decremented optimistically; no-op here or reconcile if negative
        }
      }

      // Queue order confirmation email
      if (metadata.customer_email) {
        await supabase.from('email_logs').insert({
          recipient: metadata.customer_email,
          subject: 'Your Something\'s Brewing order is confirmed',
          body: `Thank you for your order! Your payment (${id}) was successful.`
        });
      }
    }

    // TODO: Send confirmation email to customer
		// TODO: Trigger fulfillment process
	} catch (error) {
		console.error('Error handling successful payment:', error);
	}
}

// Handle failed payment
async function handleFailedPayment(paymentIntent) {
	try {
		const { id, last_payment_error, metadata } = paymentIntent;

		// Update order status in database
		if (metadata.order_id) {
			const { error } = await supabase
				.from('orders')
				.update({
					status: 'payment_failed',
					updated_at: new Date().toISOString()
				})
				.eq('id', metadata.order_id);

			if (error) {
				console.error('Error updating order status:', error);
			} else {
				console.log(`Order ${metadata.order_id} marked as payment failed`);
			}
		}

    console.log(`Payment failed: ${id}, Error: ${last_payment_error?.message || 'Unknown error'}`);

    // Restock on payment failure/cancellation (revert optimistic reservation)
    if (metadata.order_id) {
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', metadata.order_id);
      if (items) {
        for (const it of items) {
          await supabase.rpc('increment_product_stock', { p_id: it.product_id, qty: it.quantity });
        }
      }
    }

		// TODO: Send payment failure notification to customer
		// TODO: Log payment failure for analytics
	} catch (error) {
		console.error('Error handling failed payment:', error);
	}
}

// Handle customer creation
async function handleCustomerCreated(customer) {
	try {
		const { id, email, name } = customer;
		console.log(`New Stripe customer created: ${id}, Email: ${email}`);

		// TODO: Sync with local customer database if needed
		// TODO: Send welcome email
	} catch (error) {
		console.error('Error handling customer creation:', error);
	}
}

// Handle subscription payment
async function handleSubscriptionPayment(invoice) {
	try {
		const { id, customer, subscription, amount_paid } = invoice;
		console.log(`Subscription payment succeeded: ${id}, Customer: ${customer}`);

		// TODO: Update subscription status in database
		// TODO: Send subscription confirmation email
		// TODO: Schedule next delivery if applicable
	} catch (error) {
		console.error('Error handling subscription payment:', error);
	}
}

// Handle checkout session completion
async function handleCheckoutCompleted(session) {
	try {
		const { id, customer, payment_intent, metadata } = session;
		console.log(`Checkout session completed: ${id}`);

		// TODO: Process order completion
		// TODO: Send order confirmation
		// TODO: Update customer records
	} catch (error) {
		console.error('Error handling checkout completion:', error);
	}
}
