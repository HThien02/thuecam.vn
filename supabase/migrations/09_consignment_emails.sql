-- Consignment emails: require applicant email and keep a log of every email admin sends.
-- Run this in the Supabase SQL Editor after 08_consignment.sql.

-- New applications must include an email (existing rows without email are kept, constraint is NOT VALID).
alter table public.consignment_applications
  drop constraint if exists consignment_applications_email_required;
alter table public.consignment_applications
  add constraint consignment_applications_email_required
  check (email is not null and length(trim(email)) > 3) not valid;

create table if not exists public.consignment_email_logs (
  id text primary key default gen_random_uuid()::text,
  application_id text references public.consignment_applications(id) on delete cascade,
  partner_user_id uuid references public.consignment_partners(user_id) on delete cascade,
  to_email text not null,
  template_id text not null default 'custom',
  subject text not null,
  body text not null,
  status text not null default 'SENT' check (status in ('SENT', 'FAILED')),
  error text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists consignment_email_logs_application_idx on public.consignment_email_logs(application_id, created_at desc);
create index if not exists consignment_email_logs_partner_idx on public.consignment_email_logs(partner_user_id, created_at desc);

alter table public.consignment_email_logs enable row level security;
revoke all on table public.consignment_email_logs from public, anon, authenticated;
grant all on table public.consignment_email_logs to service_role;
