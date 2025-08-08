create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text not null,
  body text not null,
  status text default 'pending', -- 'pending', 'sent', 'failed'
  attempts integer default 0,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes for performance
create index on public.email_logs (recipient);
create index on public.email_logs (status);
create index on public.email_logs (created_at);


alter table public.email_logs enable row level security;

create policy "Admins only - insert/select email logs"
on public.email_logs
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);

/* Email Logs Notification Trigger */

create or replace function public.email_logs_notify()
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
    'from', json_build_object('email', 'no-reply@yourdomain.com'),
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
  update public.email_logs
  set status = 'sent', sent_at = now()
  where id = NEW.id;

  return null;
end;
$$;

create trigger on_email_log_insert
after insert on public.email_logs
for each row
execute function public.email_logs_notify();


/*##4. Allow Supabase HTTP Functions
Make sure http_post is available:

Supabase supports http_post() using the pg_net extension.

Run this if not already enabled:
*/

create extension if not exists pg_net with schema extensions;

/*Security Note
Make sure to add a Postgres config setting in your Supabase project:
*/

-- You can set this via SQL config or Supabase dashboard > Database Settings > Config Vars
alter system set custom.sendgrid_api_key = 'your_actual_sendgrid_api_key';