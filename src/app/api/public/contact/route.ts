import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const { data, error } = await createAdminClient()
    .from('site_settings')
    .select('contact_manager_name,hotline,zalo,facebook_url,instagram_url,whatsapp_url')
    .eq('id', 'global')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Contact details are temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  return NextResponse.json({ settings: data }, { headers: { 'Cache-Control': 'no-store' } });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
