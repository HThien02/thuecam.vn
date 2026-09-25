import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, isValidName, isValidVietnamPhone, sanitizeInput } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import type { RentalAddon } from '@/types';

const activeBookingStatuses = ['PENDING', 'CONFIRMED', 'RENTING', 'PAID', 'ACTIVE'];
const dayMs = 24 * 60 * 60 * 1000;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function dateKeys(start: string, end: string) {
  const dates: string[] = [];
  for (let time = Date.parse(`${start}T00:00:00.000Z`); time <= Date.parse(`${end}T00:00:00.000Z`); time += dayMs) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }
  return dates;
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = enforceApiRateLimit(request, { limit: 12, windowMs: 60_000 });
  if (rateLimitResponse) return rateLimitResponse;

  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return errorResponse('Invalid request origin.', 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request body.', 400);
  }

  const productId = typeof body.product_id === 'string' ? body.product_id : '';
  const startDate = body.start_date;
  const endDate = body.end_date;
  const customerName = typeof body.customer_name === 'string' ? body.customer_name.trim() : '';
  const customerPhone = typeof body.customer_phone === 'string' ? body.customer_phone.trim() : '';
  const customerEmail = typeof body.customer_email === 'string' ? body.customer_email.trim() : '';
  const pickupMethod = body.pickup_method === 'DELIVERY' ? 'DELIVERY' : 'STORE';
  const deliveryAddress = typeof body.delivery_address === 'string' ? body.delivery_address.trim() : '';
  const addonIds = body.addon_ids;
  const voucherCode = typeof body.voucher_code === 'string' ? body.voucher_code.trim().toUpperCase() : '';

  if (!Array.isArray(addonIds) || addonIds.length > 15 || addonIds.some((id) => typeof id !== 'string' || id.length > 80) || new Set(addonIds).size !== addonIds.length) {
    return errorResponse('Lựa chọn phụ kiện không hợp lệ.', 400);
  }
  if (voucherCode.length > 64) return errorResponse('Mã voucher không hợp lệ.', 400);

  if (!productId || !isDateKey(startDate) || !isDateKey(endDate) || endDate < startDate) {
    return errorResponse('Vui lòng chọn thiết bị và khoảng ngày thuê hợp lệ.', 400);
  }
  if (!isValidName(customerName) || !isValidVietnamPhone(customerPhone) || (customerEmail && !isValidEmail(customerEmail))) {
    return errorResponse('Vui lòng kiểm tra lại họ tên, số điện thoại và email.', 400);
  }
  if (pickupMethod === 'DELIVERY' && deliveryAddress.length < 5) {
    return errorResponse('Vui lòng nhập địa chỉ giao máy cụ thể.', 400);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (startDate < today) return errorResponse('Ngày nhận máy không thể nằm trong quá khứ.', 400);

  const days = dateKeys(startDate, endDate);
  if (days.length > 60) return errorResponse('Mỗi đơn thuê tối đa 60 ngày.', 400);

  const supabase = createAdminClient();
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id,name,rental_price_per_day,rental_addons,deposit_amount,inventory_count,status')
    .eq('id', productId)
    .eq('status', 'ACTIVE')
    .maybeSingle();
  if (productError || !product) return errorResponse('Thiết bị không còn được cho thuê.', 404);

  const [{ data: blocked, error: blockedError }, { data: bookings, error: bookingsError }] = await Promise.all([
    supabase.from('blocked_dates').select('date').gte('date', startDate).lte('date', endDate),
    supabase.from('bookings').select('product_id,start_date,end_date').in('status', activeBookingStatuses).lte('start_date', endDate).gte('end_date', startDate),
  ]);
  if (blockedError || bookingsError) return errorResponse('Không thể xác nhận tình trạng lịch thuê. Vui lòng thử lại.', 503);
  if ((blocked ?? []).length) return errorResponse('Lịch thuê đã khóa trong khoảng ngày bạn chọn.', 409);

  const capacity = Number(product.inventory_count);
  if (capacity <= 0) return errorResponse('Thiết bị hiện chưa có máy và không thể đặt thuê.', 409);

  const productBookings = (bookings ?? []).filter((booking) => booking.product_id === productId);
  const unavailable = days.some((day) => {
    const bookedCount = productBookings.filter((booking) => booking.start_date <= day && booking.end_date >= day).length;
    return bookedCount >= capacity;
  });
  if (unavailable) return errorResponse('Thiết bị đã kín lịch trong khoảng ngày bạn chọn.', 409);

  const dailyPrice = Number(product.rental_price_per_day);
  const depositAmount = Number(product.deposit_amount);
  const configuredAddons = Array.isArray(product.rental_addons) ? product.rental_addons as RentalAddon[] : [];
  const selectedAddons = addonIds.map((addonId) => configuredAddons.find((addon) => addon.id === addonId));
  if (selectedAddons.some((addon) => !addon || !addon.name || !Number.isSafeInteger(Number(addon.price_per_day)) || Number(addon.price_per_day) <= 0)) {
    return errorResponse('Một hoặc nhiều phụ kiện không còn khả dụng. Vui lòng tải lại và chọn lại.', 400);
  }
  const addonSubtotal = selectedAddons.reduce((sum, addon) => sum + Number(addon!.price_per_day) * days.length, 0);
  const basePrice = (dailyPrice * days.length) + addonSubtotal;
  const discountRate = days.length >= 7 ? 0.2 : days.length >= 3 ? 0.1 : 0;
  const subtotal = Math.max(0, basePrice - Math.round(basePrice * discountRate));
  const bookingCode = `TC${randomInt(10_000_000, 100_000_000)}`;
  const { data: booking, error: insertError } = await supabase.rpc('create_booking_with_voucher', {
    p_booking_code: bookingCode,
    p_product_id: product.id,
    p_product_name: product.name,
    p_start_date: startDate,
    p_end_date: endDate,
    p_total_days: days.length,
    p_daily_price: dailyPrice,
    p_deposit_amount: depositAmount,
    p_subtotal: subtotal,
    p_customer_name: sanitizeInput(customerName),
    p_customer_phone: customerPhone,
    p_customer_email: customerEmail || null,
    p_pickup_method: pickupMethod,
    p_delivery_address: pickupMethod === 'DELIVERY' ? sanitizeInput(deliveryAddress) : null,
    p_note: typeof body.note === 'string' ? sanitizeInput(body.note).slice(0, 2000) : null,
    p_selected_addons: selectedAddons.map((addon) => ({
      id: addon!.id,
      name: addon!.name,
      price_per_day: Number(addon!.price_per_day),
      total_price: Number(addon!.price_per_day) * days.length,
    })),
    p_voucher_code: voucherCode || null,
  });
  if (insertError || !booking) {
    if (insertError?.message.includes('VOUCHER_INVALID')) return errorResponse('Voucher không hợp lệ hoặc đã hết lượt. Vui lòng kiểm tra lại.', 409);
    return errorResponse('Không thể tạo đơn thuê. Vui lòng thử lại.', 503);
  }

  const createdBooking = typeof booking === 'object' && booking !== null ? booking as Record<string, unknown> : {};
  return NextResponse.json(createdBooking, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
