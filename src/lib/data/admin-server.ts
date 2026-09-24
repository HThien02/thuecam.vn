import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/security/session';
import { createAdminClient } from '@/lib/supabase/admin';

export type AdminTable =
  | 'products'
  | 'categories'
  | 'articles'
  | 'reviews'
  | 'redirects'
  | 'bookings'
  | 'blocked_dates'
  | 'site_settings'
  | 'seo_settings';

const sortColumns: Record<AdminTable, string> = {
  products: 'created_at',
  categories: 'display_order',
  articles: 'published_at',
  reviews: 'created_at',
  redirects: 'created_at',
  bookings: 'created_at',
  blocked_dates: 'date',
  site_settings: 'id',
  seo_settings: 'id',
};

export async function getAdminRows<T>(table: AdminTable): Promise<T[]> {
  if (!(await getAdminSession())) redirect('/admin/login');
  const ascending = table === 'categories' || table === 'blocked_dates' || table.endsWith('_settings');
  const { data, error } = await createAdminClient()
    .from(table)
    .select('*')
    .order(sortColumns[table], { ascending })
    .limit(1000);

  if (error) throw new Error(`Unable to load admin data from ${table}.`);
  return (data ?? []) as T[];
}

export async function getAdminRow<T>(table: 'site_settings' | 'seo_settings', id: string): Promise<T | null> {
  if (!(await getAdminSession())) redirect('/admin/login');
  const { data, error } = await createAdminClient().from(table).select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Unable to load admin settings from ${table}.`);
  return data as T | null;
}
