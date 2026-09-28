-- Consignment (ký gửi cho thuê): public applications, partner accounts, and unit ownership.
-- Run this in the Supabase SQL Editor before using /ky-gui, /doi-tac and /admin/consignments.

create table if not exists public.consignment_applications (
  id text primary key default gen_random_uuid()::text,
  full_name text not null,
  phone text not null,
  email text,
  city text not null default '',
  device_name text not null,
  device_brand text not null default '',
  device_condition text not null default '',
  quantity integer not null default 1 check (quantity between 1 and 50),
  purchase_year integer check (purchase_year is null or purchase_year between 2000 and 2100),
  note text not null default '',
  status text not null default 'PENDING' check (status in ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED')),
  admin_note text not null default '',
  partner_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consignment_partners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null default '',
  email text not null,
  revenue_share_percent numeric(5,2) not null default 70 check (revenue_share_percent between 0 and 100),
  active boolean not null default true,
  application_id text references public.consignment_applications(id) on delete set null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.camera_units
  add column if not exists owner_partner_id uuid references public.consignment_partners(user_id) on delete set null;

create index if not exists consignment_applications_status_idx on public.consignment_applications(status, created_at desc);
create index if not exists camera_units_owner_partner_id_idx on public.camera_units(owner_partner_id);

alter table public.consignment_applications enable row level security;
alter table public.consignment_partners enable row level security;

-- Only the server (service role) reads or writes these tables; no public/anon access.
revoke all on table public.consignment_applications from public, anon, authenticated;
revoke all on table public.consignment_partners from public, anon, authenticated;
grant all on table public.consignment_applications to service_role;
grant all on table public.consignment_partners to service_role;

-- Hide unit ownership from the public camera_units read policy.
revoke select (owner_partner_id) on public.camera_units from anon, authenticated;
