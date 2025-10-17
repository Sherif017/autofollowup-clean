'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function onClick() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="text-sm border rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
    >
      {loading ? 'Déconnexion...' : 'Se déconnecter'}
    </button>
  );
}
