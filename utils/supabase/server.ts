import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getServerSupabase() {
  const cookieStore = await cookies(); // Next 15: cookies() async

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: async (name: string) => cookieStore.get(name)?.value,
      set: async () => {},
      remove: async () => {},
    },
  });
}
