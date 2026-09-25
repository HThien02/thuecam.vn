import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  // 1. Rate limiting
  const rateLimitResponse = enforceApiRateLimit(request, { limit: 20, windowMs: 60_000 });
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Auth check: session cookie must be valid
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Phiên làm việc đã hết hạn.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file ảnh để tải lên.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Định dạng file không được hỗ trợ. Vui lòng chọn ảnh JPG, PNG, WEBP, AVIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Dung lượng ảnh vượt quá giới hạn 5MB. Vui lòng chọn ảnh nhẹ hơn.' },
        { status: 400 }
      );
    }

    // Convert file to Base64 Data URL for persistent database storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType,
    });
  } catch (error) {
    console.error('[Upload Image Error]:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xử lý file ảnh tải lên.' },
      { status: 500 }
    );
  }
}
