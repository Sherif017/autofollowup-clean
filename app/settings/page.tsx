'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function SettingsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [openaiKey, setOpenaiKey] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [frequency, setFrequency] = useState(7);
  const [message, setMessage] = useState<string | null>(null);

  // Récupère les réglages à l’ouverture
  useEffect(() => {
    async function loadSettings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage('Tu dois être connecté pour modifier tes paramètres.');
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setOpenaiKey(data.openai_key ?? '');
        setTone(data.preferred_tone ?? 'professionnel');
        setFrequency(data.followup_frequency ?? 7);
      }

      setLoading(false);
    }

    loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Tu dois être connecté.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        openai_key: openaiKey || null,
        preferred_tone: tone,
        followup_frequency: frequency,
      });

    if (error) setMessage(`❌ Erreur: ${error.message}`);
    else setMessage('✅ Paramètres enregistrés !');
    setLoading(false);
  }

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Chargement...</p>;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-4">Paramètres de ton compte</h1>

      {message && (
        <div className="mb-4 p-2 bg-gray-100 border rounded text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Clé OpenAI personnelle (optionnelle)
          </label>
          <input
            type="password"
            placeholder="sk-..."
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si tu veux utiliser ta propre clé OpenAI. Laisse vide sinon.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ton du message
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          >
            <option value="professionnel">Professionnel</option>
            <option value="chaleureux">Chaleureux</option>
            <option value="direct">Direct</option>
            <option value="créatif">Créatif</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fréquence de relance (en jours)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={frequency}
            onChange={(e) => setFrequency(parseInt(e.target.value))}
            className="mt-1 w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
