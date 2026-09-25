import { NextRequest, NextResponse } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import type { RentalAddon } from '@/types';

const dayMs = 24 * 60 * 60 * 1000;

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request: NextRequest) {
  const limited = enforceApiRateLimit(request, { limit: 20, windowMs: 60_000 });
  if (limited) return limited;
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid request origin.', 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return responseError('Invalid request body.', 400);
  }

  const productId = typeof body.product_id === 'string' ? body.product_id : '';
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  const startDate = body.start_date;
  const endDate = body.end_date;
  const addonIds = body.addon_ids;
  if (!code || code.length > 64 || !productId || !isDateKey(startDate) || !isDateKey(endDate) || endDate < startDate) {
    return responseError('Mã voucher hoặc khoảng ngày không hợp lệ.', 400);
  }
  if (!Array.isArray(addonIds) || addonIds.length > 15 || addonIds.some((id) => typeof id !== 'string') || new Set(addonIds).size !== addonIds.length) {
    return responseError('Lựa chọn phụ kiện không hợp lệ.', 400);
  }
  const totalDays = Math.floor((Date.parse(`${endDate}T00:00:00.000Z`) - Date.parse(`${startDate}T00:00:00.000Z`)) / dayMs) + 1;
  if (totalDays < 1 || totalDays > 60) return responseError('Mỗi đơn thuê tối đa 60 ngày.', 400);

  const supabase = createAdminClient();
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id,rental_price_per_day,rental_addons,status')
    .eq('id', productId)
    .eq('status', 'ACTIVE')
    .maybeSingle();
  if (productError || !product) return responseError('Thiết bị không còn được cho thuê.', 404);

  const addons = (Array.isArray(product.rental_addons) ? product.rental_addons : []) as RentalAddon[];
  const selectedAddons = addonIds.map((id) => addons.find((addon) => addon.id === id));
  const addonPrices = selectedAddons.map((addon) => Number(addon?.price_per_rental ?? addon?.price_per_day));
  if (selectedAddons.some((addon, index) => !addon || !Number.isSafeInteger(addonPrices[index]) || addonPrices[index] <= 0)) {
    return responseError('Một hoặc nhiều phụ kiện không còn khả dụng.', 400);
  }
  const basePrice = (Number(product.rental_price_per_day) * totalDays)
    + addonPrices.reduce((sum, price) => sum + price, 0);
  const discountRate = totalDays >= 7 ? 0.2 : totalDays >= 3 ? 0.1 : 0;
  const subtotal = Math.max(0, basePrice - Math.round(basePrice * discountRate));
  const { data, error } = await supabase.rpc('validate_voucher', { p_code: code, p_subtotal: subtotal });
  if (error) return responseError('Không thể kiểm tra voucher lúc này.', 503);
  const result = data && typeof data === 'object' ? data as Record<string, unknown> : {};
  if (result.valid !== true) return NextResponse.json({ valid: false }, { headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json({ valid: true, code: result.code, discount: Number(result.discount) }, { headers: { 'Cache-Control': 'no-store' } });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
