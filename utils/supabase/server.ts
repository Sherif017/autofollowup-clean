import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServerSupabase() {
  // ⬅️ cookies() est async en Next 15
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY non définie');
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // lecture seule
        }
      },
      remove: (name: string, options: any) => {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // lecture seule
        }
      },
    },
  });

  return supabase;
}
