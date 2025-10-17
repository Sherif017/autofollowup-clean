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
      <body className="min-h-screen bg-gray-50 text-gray-800">
        {/* Barre de navigation */}
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            {/* Logo / Nom produit */}
            <Link href="/" className="text-lg font-semibold hover:text-gray-700">
              AutoFollowUp
            </Link>

            {/* Navigation principale */}
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-gray-700">
                Contacts
              </Link>
              <Link href="/settings" className="hover:text-gray-700">
                Paramètres
              </Link>
            </nav>

            {/* Authentification */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden sm:inline text-gray-600 text-sm">
                    {user.email}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/login"
                  className="underline text-sm text-blue-600 hover:text-blue-800"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Conteneur central */}
        <main className="max-w-5xl mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-white text-center text-sm py-4 mt-10 text-gray-500">
          © {new Date().getFullYear()} AutoFollowUp — Mini CRM IA
        </footer>
      </body>
    </html>
  );
}
