import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

const fields = {
  products: ['id', 'slug', 'name', 'sku', 'brand_id', 'category_id', 'excerpt', 'description', 'specs', 'accessories_included', 'rental_price_per_day', 'rental_addons', 'deposit_amount', 'primary_image', 'gallery_images', 'inventory_count', 'status', 'seo_title', 'seo_description', 'seo_keywords', 'canonical_url', 'og_title', 'og_description', 'og_image', 'indexable', 'created_at', 'updated_at'],
  brands: ['id', 'slug', 'name', 'logo_url', 'description', 'seo_title', 'seo_description', 'indexable', 'created_at'],
  categories: ['id', 'slug', 'name', 'h1', 'intro_content', 'description', 'icon', 'seo_title', 'seo_description', 'og_image', 'display_order', 'indexable', 'created_at'],
  articles: ['id', 'slug', 'type', 'title', 'excerpt', 'content', 'featured_image', 'camera_settings', 'gallery_images', 'author_name', 'author_avatar', 'author_bio', 'reviewer_name', 'pillar_slug', 'related_product_ids', 'faq', 'status', 'seo_title', 'seo_description', 'canonical_url', 'og_image', 'indexable', 'published_at', 'updated_at'],
  reviews: ['id', 'product_id', 'user_name', 'rating', 'comment', 'rental_verified', 'status', 'created_at'],
  redirects: ['id', 'old_url', 'new_url', 'status_code', 'is_active', 'created_at'],
  bookings: ['id', 'booking_code', 'product_id', 'product_name', 'start_date', 'end_date', 'total_days', 'daily_price', 'deposit_amount', 'total_price', 'customer_name', 'customer_phone', 'customer_email', 'customer_cccd', 'pickup_method', 'pickup_time', 'delivery_address', 'note', 'status', 'created_at', 'updated_at'],
  blocked_dates: ['id', 'date', 'reason', 'created_at'],
  site_settings: ['id', 'site_name', 'pickup_address', 'hotline', 'zalo', 'email', 'open_hours', 'promo_banner', 'deposit_policy', 'contact_manager_name', 'facebook_url', 'instagram_url', 'whatsapp_url', 'updated_at'],
  seo_settings: ['id', 'site_title', 'site_description', 'default_og_image', 'twitter_handle', 'business_name', 'hotline', 'email', 'address', 'opening_hours', 'google_verification_id', 'global_noindex_enabled', 'updated_at'],
} as const;

type AdminTable = keyof typeof fields;
const tableNames = new Set<string>(Object.keys(fields));
const sortColumns: Record<AdminTable, string> = {
  products: 'created_at', brands: 'name', categories: 'display_order', articles: 'published_at',
  reviews: 'created_at', redirects: 'created_at', bookings: 'created_at',
  blocked_dates: 'date', site_settings: 'id', seo_settings: 'id',
};

function isAdminTable(value: string | null): value is AdminTable {
  return Boolean(value && tableNames.has(value));
}

function responseError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function requireAdmin() {
  return getAdminSession();
}

function pickAllowedFields(table: AdminTable, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const allowed = new Set<string>(fields[table]);
  return Object.fromEntries(Object.entries(value).filter(([key]) => allowed.has(key)));
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) return responseError('Unauthorized', 401);
  const table = request.nextUrl.searchParams.get('table');
  if (!isAdminTable(table)) return responseError('Unsupported data collection.');

  const supabase = createAdminClient();
  const ascending = table === 'categories' || table === 'blocked_dates' || table.endsWith('_settings');
  const { data, error } = await supabase.from(table).select('*').order(sortColumns[table], { ascending }).limit(1000);
  if (error) return responseError('Unable to load records.', 500);
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return responseError('Unauthorized', 401);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid origin.', 403);

  let body: { table?: string; record?: unknown; operation?: 'create' | 'update' };
  try {
    body = await request.json();
  } catch {
    return responseError('Invalid request body.');
  }
  if (!isAdminTable(body.table ?? null)) return responseError('Unsupported data collection.');
  const tableName = body.table ?? null;
  if (!isAdminTable(tableName)) return responseError('Unsupported data collection.');
  const table: AdminTable = tableName;
  const record = pickAllowedFields(table, body.record);
  if (!record || Object.keys(record).length === 0) return responseError('No valid record fields were provided.');

  if (table === 'site_settings') {
    for (const field of ['facebook_url', 'instagram_url', 'whatsapp_url']) {
      const link = record[field];
      if (typeof link === 'string' && link.trim()) {
        try {
          if (new URL(link).protocol !== 'https:') return responseError('Liên kết mạng xã hội phải bắt đầu bằng https://.', 400);
        } catch {
          return responseError('Vui lòng nhập liên kết mạng xã hội hợp lệ.', 400);
        }
      }
    }
  }

  if (table === 'bookings' && !record.booking_code) {
    record.booking_code = `TC${randomInt(100000, 1000000)}`;
  }
  if (table === 'site_settings') record.id = 'global';
  if (table === 'seo_settings') record.id = 'global-seo-settings';
  if (['products', 'articles', 'bookings', 'site_settings', 'seo_settings'].includes(table)) {
    record.updated_at = new Date().toISOString();
  }

  const supabase = createAdminClient();
  const key = table === 'blocked_dates' ? 'date' : table === 'bookings' ? 'booking_code' : 'id';
  const keyValue = record[key];
  let query;
  if (keyValue) {
    const updateRecord = { ...record };
    const { data, error } = await supabase.from(table).update(updateRecord).eq(key, keyValue).select('*').maybeSingle();
    if (error) {
      console.error(`[v0] Admin ${table} update failed:`, error.message);
      const reason = error.message.replace(/[\r\n]/g, ' ').slice(0, 240);
      return responseError(table === 'products' ? `Không thể cập nhật thiết bị: ${reason}` : 'Unable to save record.', 400);
    }
    if (data) return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
    if (table.endsWith('_settings') || body.operation === 'update') return responseError('Record not found.', 404);
    query = supabase.from(table).insert(record).select('*').single();
  } else {
    query = supabase.from(table).insert(record).select('*').single();
  }

  const { data, error } = await query;
  if (error) {
    console.error(`[v0] Admin ${table} create failed:`, error.message);
    const reason = error.message.replace(/[\r\n]/g, ' ').slice(0, 240);
    return responseError(table === 'products' ? `Không thể tạo thiết bị: ${reason}` : 'Unable to create record.', 400);
  }
  return NextResponse.json(data, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) return responseError('Unauthorized', 401);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid origin.', 403);

  const table = request.nextUrl.searchParams.get('table');
  const id = request.nextUrl.searchParams.get('id');
  if (!isAdminTable(table) || !id || table.endsWith('_settings')) return responseError('Invalid delete request.');
  const key = table === 'blocked_dates' ? 'date' : table === 'bookings' ? 'booking_code' : 'id';
  const { error } = await createAdminClient().from(table).delete().eq(key, id);
  if (error) return responseError('Unable to delete record.', 400);
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
