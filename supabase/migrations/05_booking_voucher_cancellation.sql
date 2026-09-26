create or replace function public.restore_booking_voucher_usage_on_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status is not distinct from new.status
    or old.voucher_code is null
    or btrim(old.voucher_code) = '' then
    return new;
  end if;

  if old.status <> 'CANCELLED' and new.status = 'CANCELLED' then
    update public.vouchers
    set used_count = greatest(used_count - 1, 0),
        updated_at = now()
    where upper(code) = upper(btrim(old.voucher_code));
  elsif old.status = 'CANCELLED' and new.status <> 'CANCELLED' then
    update public.vouchers
    set used_count = used_count + 1,
        updated_at = now()
    where upper(code) = upper(btrim(old.voucher_code));
  end if;

  return new;
end;
$$;

revoke all on function public.restore_booking_voucher_usage_on_status_change() from public, anon, authenticated;

drop trigger if exists booking_voucher_usage_status_change on public.bookings;
create trigger booking_voucher_usage_status_change
after update of status on public.bookings
for each row
execute function public.restore_booking_voucher_usage_on_status_change();

comment on function public.restore_booking_voucher_usage_on_status_change() is
  'Returns one voucher use when a booking is cancelled and consumes one again if it is reactivated.';

comment on trigger booking_voucher_usage_status_change on public.bookings is
  'Keeps voucher used_count in sync with booking cancellation status transitions.';

-- Install this migration against an existing Supabase project with the Supabase migration tool.
