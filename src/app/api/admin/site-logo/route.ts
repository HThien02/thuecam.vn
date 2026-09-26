import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

const bucketName = 'product-images';
const objectPath = 'branding/site-logo';
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
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

function hasValidImageSignature(fileType: string, bytes: Uint8Array) {
  if (fileType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (fileType === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (fileType === 'image/webp') {
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  }
  if (fileType === 'image/avif') {
    const brand = String.fromCharCode(...bytes.slice(8, 12));
    return String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp' && (brand === 'avif' || brand === 'avis');
  }
  return false;
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
  if (!(file instanceof File)) return responseError('Vui lòng chọn một file ảnh hợp lệ.');
  if (!fileExtensions[file.type]) return responseError('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.');
  if (file.size === 0 || file.size > maxFileSize) return responseError('Logo phải có dung lượng dưới 4 MB.');

  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!hasValidImageSignature(file.type, signature)) return responseError('Nội dung file không đúng định dạng ảnh đã chọn.');

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucketName).upload(objectPath, file, {
    cacheControl: '0',
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    console.error('[v0] Site logo upload failed:', error.message);
    return responseError('Không thể lưu logo vào kho ảnh hiện có.', 500);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);
  const url = new URL(data.publicUrl);
  url.searchParams.set('v', Date.now().toString());
  return NextResponse.json({ url: url.toString() }, { headers: { 'Cache-Control': 'no-store' } });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
