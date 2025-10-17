'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function onClick() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      className="text-sm rounded border px-3 py-1 hover:bg-gray-50"
      title="Se déconnecter"
    >
      Se déconnecter
    </button>
  );
}
