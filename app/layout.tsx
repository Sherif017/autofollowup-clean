import './globals.css';
import Link from 'next/link';
import { getServerSupabase } from '../utils/supabase/server';
import LogoutButton from '../components/LogoutButton';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AutoFollowUp',
  description: 'Mini CRM + relances IA',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">
              AutoFollowUp
            </Link>

            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <span className="text-gray-600 hidden sm:inline">
                    {user.email}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <Link href="/login" className="underline">
                  Se connecter
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Contenu de la page */}
        {children}
      </body>
    </html>
  );
}
