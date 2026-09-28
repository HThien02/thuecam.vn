-- Adds the immutable pricing snapshot needed by the admin order detail view.
-- Apply this migration to the connected Supabase project before using the new fields.
alter table public.bookings
  add column if not exists voucher_code text,
  add column if not exists subtotal numeric(12,2),
  add column if not exists voucher_discount numeric(12,2) not null default 0,
  add column if not exists selected_addons jsonb not null default '[]'::jsonb;

update public.bookings
set subtotal = total_price
where subtotal is null;

alter table public.bookings
  alter column subtotal set default 0;

create index if not exists bookings_voucher_code_idx
  on public.bookings(voucher_code)
  where voucher_code is not null;

-- Voucher usage is restored exactly once when a booking enters CANCELLED,
-- and consumed again if an administrator reactivates that booking.
create or replace function public.restore_booking_voucher_usage_on_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status
    and nullif(btrim(old.voucher_code), '') is not null then
    if old.status is distinct from 'CANCELLED' and new.status = 'CANCELLED' then
      update public.vouchers
      set used_count = greatest(used_count - 1, 0), updated_at = now()
      where upper(code) = upper(btrim(old.voucher_code));
    elsif old.status = 'CANCELLED' and new.status is distinct from 'CANCELLED' then
      update public.vouchers
      set used_count = used_count + 1, updated_at = now()
      where upper(code) = upper(btrim(old.voucher_code));
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists booking_voucher_usage_status_change on public.bookings;
create trigger booking_voucher_usage_status_change
after update of status on public.bookings
for each row
when (old.status is distinct from new.status)
execute function public.restore_booking_voucher_usage_on_status_change();

revoke all on function public.restore_booking_voucher_usage_on_status_change() from public, anon, authenticated;
 grant execute on function public.restore_booking_voucher_usage_on_status_change() to service_role;
