Use Case in Your Supabase Project
Log Email Activity:

Anytime an action (like promoting a user to admin) occurs, an entry is added here with:

recipient email (e.g. the super admin)

subject and body of the email

status: initially set to 'pending'

Trigger or Cron Job (Optional):

You can later set up an external service (like a Supabase Edge Function or cron job with SendGrid) to:

Poll email_logs where status = 'pending'

Send the email

Update status to 'sent' or 'failed', and sent_at timestamp
