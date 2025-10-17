import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getServerSupabase() {
  // Next 15 : cookies() est asynchrone
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;

  // Handlers en async pour éviter l'erreur "cookies() should be awaited"
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: async (name: string) => {
        return cookieStore.get(name)?.value;
      },
      set: async (_name: string, _value: string, _options: any) => {
        // No-op (Next 15: cookies() de next/headers est read-only côté serveur)
      },
      remove: async (_name: string, _options: any) => {
        // No-op
      },
    },
  });
}
