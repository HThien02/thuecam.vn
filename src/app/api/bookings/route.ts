import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, isValidName, isValidVietnamPhone, sanitizeInput } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

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
    .select('id,name,rental_price_per_day,deposit_amount,inventory_count,status')
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
  const basePrice = dailyPrice * days.length;
  const discountRate = days.length >= 7 ? 0.2 : days.length >= 3 ? 0.1 : 0;
  const totalPrice = Math.round(basePrice * (1 - discountRate));
  const bookingCode = `TC${randomInt(10_000_000, 100_000_000)}`;
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      booking_code: bookingCode,
      product_id: product.id,
      product_name: product.name,
      start_date: startDate,
      end_date: endDate,
      total_days: days.length,
      daily_price: dailyPrice,
      deposit_amount: depositAmount,
      total_price: totalPrice,
      customer_name: sanitizeInput(customerName),
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      pickup_method: pickupMethod,
      delivery_address: pickupMethod === 'DELIVERY' ? sanitizeInput(deliveryAddress) : null,
      note: typeof body.note === 'string' ? sanitizeInput(body.note).slice(0, 2000) : null,
      status: 'PENDING',
    })
    .select('id,booking_code,total_days,daily_price,deposit_amount,total_price,status')
    .single();
  if (insertError || !booking) return errorResponse('Không thể tạo đơn thuê. Vui lòng thử lại.', 503);

  return NextResponse.json(booking, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
