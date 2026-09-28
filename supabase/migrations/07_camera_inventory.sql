create table if not exists public.camera_series (
  id text primary key default gen_random_uuid()::text,
  name text not null unique,
  slug text not null unique,
  product_id text references public.products(id) on delete set null,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.camera_units (
  id text primary key default gen_random_uuid()::text,
  series_id text not null references public.camera_series(id) on delete restrict,
  serial_number text not null unique,
  label text not null default '',
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE','MAINTENANCE','RETIRED')),
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_camera_assignments (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null unique references public.bookings(id) on delete cascade,
  unit_id text not null references public.camera_units(id) on delete restrict,
  assigned_by text not null default 'AUTO',
  created_at timestamptz not null default now()
);

create index if not exists camera_units_series_id_idx on public.camera_units(series_id);
create index if not exists booking_camera_assignments_unit_id_idx on public.booking_camera_assignments(unit_id);

alter table public.camera_series enable row level security;
alter table public.camera_units enable row level security;
alter table public.booking_camera_assignments enable row level security;

drop policy if exists "Public read active camera series" on public.camera_series;
create policy "Public read active camera series" on public.camera_series for select to anon, authenticated using (active = true);

drop policy if exists "Public read camera units" on public.camera_units;
create policy "Public read camera units" on public.camera_units for select to anon, authenticated using (true);

drop policy if exists "Public read booking camera assignments" on public.booking_camera_assignments;
create policy "Public read booking camera assignments" on public.booking_camera_assignments for select to anon, authenticated using (true);

grant select on public.camera_series, public.camera_units, public.booking_camera_assignments to anon, authenticated;

create or replace function public.auto_assign_camera_unit()
returns trigger
language plpgsql
security invoker
as $$
declare
  candidate_id text;
begin
  if new.status in ('CANCELLED', 'COMPLETED') then return new; end if;
  if exists (select 1 from public.booking_camera_assignments where booking_id = new.id) then return new; end if;

  select cu.id into candidate_id
  from public.camera_units cu
  join public.camera_series cs on cs.id = cu.series_id
  where cu.status = 'AVAILABLE'
    and cs.product_id = new.product_id
    and not exists (
      select 1 from public.booking_camera_assignments bca
      join public.bookings b on b.id = bca.booking_id
      where bca.unit_id = cu.id
        and b.status not in ('CANCELLED', 'COMPLETED')
        and b.start_date <= new.end_date
        and b.end_date >= new.start_date
    )
  order by cu.created_at
  limit 1;

  if candidate_id is not null then
    insert into public.booking_camera_assignments (booking_id, unit_id, assigned_by)
    values (new.id, candidate_id, 'AUTO')
    on conflict (booking_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists auto_assign_camera_unit_on_booking on public.bookings;
create trigger auto_assign_camera_unit_on_booking
after insert on public.bookings
for each row execute function public.auto_assign_camera_unit();
