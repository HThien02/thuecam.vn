import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? process.env.SUPABASE_URL_2 ?? process.env.SUPABASE_URL_3;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY_2 ?? process.env.SUPABASE_PUBLISHABLE_KEY_2 ?? process.env.SUPABASE_ANON_KEY_3 ?? process.env.SUPABASE_PUBLISHABLE_KEY_3;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase public credentials are not configured.');
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
}
