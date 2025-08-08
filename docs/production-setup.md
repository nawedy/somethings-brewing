# Production Setup Runbook

This document outlines steps to configure and launch the app in production (Vercel + Supabase + Stripe + SendGrid + GA4).

## Environment Variables (Vercel)
- PUBLIC_SUPABASE_URL
- PUBLIC_SUPABASE_ANON_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- SENDGRID_API_KEY
- NEXT_PUBLIC_GA_MEASUREMENT_ID (optional for GA4)

## Supabase
- Run migrations in `src/supabase/migration.sql`
- Verify RLS policies and auth settings
- Configure email templates and domain settings

## Stripe
- Set webhook endpoint to `/api/webhooks/stripe`
- Use test keys for staging; live keys for production

## SendGrid
- Create API key and set Verified Sender / Domain

## Vercel
- Project framework: SvelteKit
- Confirm `vercel.json` headers and env mapping

## Monitoring
- Enable Vercel Analytics
- Optionally configure GA4 (add gtag snippet in layout if using GA)


