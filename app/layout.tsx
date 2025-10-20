import './globals.css';
import Link from 'next/link';
import { getServerSupabase } from '../utils/supabase/server';
import LogoutButton from '../components/LogoutButton';
import Container from '../components/Container';
import ToastFromSearchParams from '../components/ToastFromSearchParams';

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
        <header className="border-b bg-white shadow-sm">
          <Container>
            <div className="py-3 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="font-semibold text-lg">
                AutoFollowUp
              </Link>

              {/* Navigation principale */}
              <nav className="flex items-center gap-5 text-sm">
                {user && (
                  <>
                    <Link href="/dashboard" className="hover:underline">
                      Tableau de bord
                    </Link>
                    <Link href="/" className="hover:underline">
                      Contacts
                    </Link>
                    <Link href="/import" className="hover:underline">
                      Import CSV
                    </Link>
                    <Link href="/sent" className="hover:underline">
                      Historique
                    </Link>
                    <Link href="/settings" className="hover:underline">
                      Paramètres
                    </Link>
                  </>
                )}

                {/* Espace utilisateur */}
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 hidden sm:inline">
                      {user.email}
                    </span>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link href="/login" className="underline">
                    Se connecter
                  </Link>
                )}
              </nav>
            </div>
          </Container>
        </header>

        {/* Toast global (succès / erreur) */}
        <ToastFromSearchParams />

        {/* Contenu principal */}
        <main className="py-6">
          <Container>{children}</Container>
        </main>

        {/* Footer */}
        <footer className="border-t text-center text-xs text-gray-500 py-4 bg-white">
          © {new Date().getFullYear()} AutoFollowUp — Mini CRM propulsé par IA
        </footer>
      </body>
    </html>
  );
}
