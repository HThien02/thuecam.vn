create or replace function public.restore_voucher_use_on_booking_status_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if nullif(btrim(new.voucher_code), '') is null then
    return new;
  end if;

  if old.status is distinct from 'CANCELLED' and new.status = 'CANCELLED' then
    update public.vouchers
    set used_count = greatest(used_count - 1, 0),
        updated_at = now()
    where upper(code) = upper(new.voucher_code);
  elsif old.status = 'CANCELLED' and new.status is distinct from 'CANCELLED' then
    update public.vouchers
    set used_count = used_count + 1,
        updated_at = now()
    where upper(code) = upper(new.voucher_code);
  end if;

  return new;
end;
$$;

drop trigger if exists restore_voucher_use_on_booking_status_change on public.bookings;

create trigger restore_voucher_use_on_booking_status_change
after update of status on public.bookings
for each row
when (old.status is distinct from new.status)
execute function public.restore_voucher_use_on_booking_status_change();
