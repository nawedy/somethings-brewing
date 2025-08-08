# 🔧 Stripe Integration Setup Guide

## Something's Brewing Coffee Shop

**Created:** January 27, 2025  
**Status:** Development Ready  
**Integration:** Test Mode Configuration

---

## 🎯 Overview

This guide provides step-by-step instructions for setting up Stripe payment processing for the Something's Brewing coffee shop application.

---

## 📋 Prerequisites

- [ ] Stripe account created
- [ ] Test mode enabled
- [ ] Environment variables configured
- [ ] Webhook endpoints set up

---

## 🔑 Step 1: Create Stripe Account

### 1.1 Account Creation

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create account
3. Complete business verification (can be done later for testing)
4. Enable test mode for development

### 1.2 Get API Keys

1. Navigate to **Developers > API Keys**
2. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

---

## 🌐 Step 2: Configure Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Configuration
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Optional: Stripe Configuration
STRIPE_CURRENCY=usd
STRIPE_COUNTRY=US
```

---

## 🔗 Step 3: Set Up Webhook Endpoints

### 3.1 Create Webhook Endpoint

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.created`
   - `invoice.payment_succeeded`
   - `checkout.session.completed`

### 3.2 Get Webhook Secret

1. Click on your created webhook
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add to environment variables

---

## 🛠️ Step 4: Test Integration

### 4.1 Test Card Numbers

Use these test card numbers in development:

| Card Number        | Brand | Result                  |
| ------------------ | ----- | ----------------------- |
| `4242424242424242` | Visa  | Success                 |
| `4000000000000002` | Visa  | Card declined           |
| `4000000000009995` | Visa  | Insufficient funds      |
| `4000002500003155` | Visa  | Authentication required |

### 4.2 Test Payment Flow

1. Start development server
2. Navigate to checkout page
3. Enter test card information
4. Complete payment process
5. Verify webhook events received

---

## 📡 Step 5: API Routes Setup

The following API routes need to be created:

### 5.1 Payment Intent Route

**File:** `src/routes/api/create-payment-intent/+server.js`

```javascript
import { createPaymentIntent } from '$lib/stripe-server.js';

export async function POST({ request }) {
	const { amount, currency, metadata } = await request.json();

	const result = await createPaymentIntent({
		amount,
		currency,
		metadata
	});

	return new Response(JSON.stringify(result), {
		headers: { 'Content-Type': 'application/json' }
	});
}
```

### 5.2 Webhook Handler Route

**File:** `src/routes/api/webhooks/stripe/+server.js`

```javascript
import { verifyWebhookSignature, handleWebhookEvent } from '$lib/stripe-server.js';

export async function POST({ request }) {
	const payload = await request.text();
	const signature = request.headers.get('stripe-signature');

	const { verified, event, error } = verifyWebhookSignature(payload, signature);

	if (!verified) {
		return new Response('Webhook signature verification failed', { status: 400 });
	}

	await handleWebhookEvent(event);

	return new Response('OK', { status: 200 });
}
```

---

## 🔒 Step 6: Security Configuration

### 6.1 CORS Configuration

Ensure your domain is allowed in Stripe dashboard:

1. Go to **Settings > Account details**
2. Add your domain to allowed domains

### 6.2 Webhook Security

- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency for webhook handling

---

## 🧪 Step 7: Testing Checklist

- [ ] Environment variables loaded correctly
- [ ] Stripe client initializes without errors
- [ ] Payment intent creation works
- [ ] Card payment flow completes
- [ ] Webhook events are received and processed
- [ ] Error handling works for declined cards
- [ ] Refund functionality works
- [ ] Customer creation and retrieval works

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Stripe Dashboard

Monitor the following in Stripe dashboard:

- Payment volume and success rates
- Failed payment reasons
- Customer growth
- Revenue analytics

### 8.2 Application Logging

Log the following events:

- Payment intent creation
- Successful payments
- Failed payments
- Webhook events processed
- Errors and exceptions

---

## 🚀 Step 9: Production Deployment

### 9.1 Switch to Live Mode

1. Complete Stripe account verification
2. Switch to live mode in dashboard
3. Update environment variables with live keys:
   - `pk_live_` for publishable key
   - `sk_live_` for secret key
4. Update webhook endpoint URLs

### 9.2 Production Checklist

- [ ] Live API keys configured
- [ ] Webhook endpoints updated
- [ ] SSL certificates installed
- [ ] Error monitoring active
- [ ] Payment flow tested end-to-end
- [ ] Refund process tested
- [ ] Customer support procedures documented

---

## 📞 Support & Resources

### Stripe Resources

- [Stripe Documentation](https://stripe.com/docs)
- [API Reference](https://stripe.com/docs/api)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Test Cards](https://stripe.com/docs/testing#cards)

### Integration Files Created

- `src/lib/stripe.js` - Client-side Stripe utilities
- `src/lib/stripe-server.js` - Server-side Stripe integration
- API routes (to be created in next tasks)

---

**Setup Guide Maintained By:** Development Team  
**Last Updated:** January 27, 2025  
**Next Review:** After API routes implementation

> 📝 **Note:** This setup guide should be followed step-by-step to ensure proper Stripe integration. All test transactions should be completed before switching to live mode.
