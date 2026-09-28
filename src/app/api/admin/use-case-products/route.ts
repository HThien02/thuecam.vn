import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

function responseError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid origin.', 403);

  let body: { useCaseId?: unknown; productIds?: unknown };
  try {
    body = await request.json();
  } catch {
    return responseError('Invalid request body.');
  }

  const useCaseId = typeof body.useCaseId === 'string' ? body.useCaseId.trim() : '';
  const productIds = Array.isArray(body.productIds)
    ? [...new Set(body.productIds.filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 200))]
    : null;
  if (!useCaseId || !productIds || productIds.length > 500) return responseError('Dữ liệu gán thiết bị không hợp lệ.');

  const supabase = createAdminClient();
  const { error: deleteError } = await supabase.from('product_use_cases').delete().eq('use_case_id', useCaseId);
  if (deleteError) return responseError('Không thể cập nhật thiết bị gợi ý.', 500);

  if (productIds.length) {
    const { error: insertError } = await supabase
      .from('product_use_cases')
      .insert(productIds.map((productId) => ({ product_id: productId, use_case_id: useCaseId })));
    if (insertError) return responseError('Không thể gán thiết bị cho nhu cầu.', 500);
  }

  return NextResponse.json({ useCaseId, productIds }, { headers: { 'Cache-Control': 'no-store' } });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
