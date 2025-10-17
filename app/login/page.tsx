'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/'); // redirection vers la page d’accueil
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {isSignUp ? 'Créer un compte' : 'Connexion'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded p-2"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {loading ? 'Chargement…' : isSignUp ? 'Créer un compte' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isSignUp ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
          <button
            className="underline text-blue-600 hover:text-blue-800"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>

        <hr className="my-6" />
        <button
          onClick={handleLogout}
          className="w-full text-sm underline text-gray-600 hover:text-gray-900"
        >
          Se déconnecter
        </button>
      </div>
    </main>
  );
}
