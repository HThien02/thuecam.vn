import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

const bucketName = 'product-images';
const maxFileSize = 4 * 1024 * 1024;
const fileExtensions: Record<string, string> = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function responseError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  return !origin || new URL(origin).host === request.headers.get('host');
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  if (!hasValidOrigin(request)) return responseError('Invalid origin.', 403);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return responseError('Yêu cầu tải ảnh không hợp lệ.');
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return responseError('Vui lòng chọn một ảnh hợp lệ.');
  const extension = fileExtensions[file.type];
  if (!extension) return responseError('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.');
  if (file.size === 0 || file.size > maxFileSize) {
    return responseError('Ảnh sau khi nén phải nhỏ hơn 4MB.');
  }

  const path = `products/${randomUUID()}.${extension}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('[v0] Product image upload failed:', error.message);
    const reason = error.message.replace(/[\r\n]/g, ' ').slice(0, 240);
    return responseError(`Supabase từ chối ảnh: ${reason}`, 500);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return NextResponse.json({ path, url: data.publicUrl }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  if (!hasValidOrigin(request)) return responseError('Invalid origin.', 403);

  let paths: unknown;
  try {
    const body = await request.json();
    paths = body.paths;
  } catch {
    return responseError('Yêu cầu xóa ảnh không hợp lệ.');
  }

  if (!Array.isArray(paths) || paths.length > 100 || paths.some((path) =>
    typeof path !== 'string' || !/^products\/[0-9a-f-]{36}\.(avif|jpg|png|webp)$/.test(path),
  )) {
    return responseError('Danh sách ảnh cần xóa không hợp lệ.');
  }
  if (paths.length === 0) return new NextResponse(null, { status: 204 });

  const { error } = await createAdminClient().storage.from(bucketName).remove(paths);
  if (error) {
    console.error('[v0] Product image cleanup failed:', error.message);
    return responseError('Không thể dọn ảnh tải lên chưa lưu.', 500);
  }

  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
