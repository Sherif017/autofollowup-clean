import { getServerSupabase } from '@/utils/supabase/server';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Connexion requise 🔒</p>
        <Link href="/login" className="text-blue-600 underline">
          Se connecter
        </Link>
      </div>
    );
  }

  // 1️⃣ Récupère tous les envois avec le contact lié
  const { data: sentEmails, error } = await supabase
    .from('sent_email')
    .select(
      `
      status,
      created_at,
      contact:contact_id (
        first_name,
        last_name
      )
      `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="p-6 text-red-600">
        Erreur chargement du tableau de bord.
      </div>
    );
  }

  // 2️⃣ Typage correct - contact est un tableau Supabase
  interface SentEmail {
    status: string;
    created_at: string;
    contact: Array<{
      first_name: string;
      last_name: string;
    }> | null;
  }

  const typedEmails: SentEmail[] = (sentEmails as SentEmail[]) ?? [];

  // 3️⃣ Calculs simples
  const total = typedEmails.length;
  const sent = typedEmails.filter((m) => m.status === 'sent').length;
  const failed = typedEmails.filter((m) => m.status === 'failed').length;
  const queued = typedEmails.filter((m) => m.status === 'queued').length;
  const last = typedEmails[0];
  const failRate = total ? Math.round((failed / total) * 100) : 0;

  // 4️⃣ Helper pour affichage contact (évite l’erreur TypeScript)
  const getContactName = (email: SentEmail) => {
    if (Array.isArray(email.contact) && email.contact.length > 0) {
      const c = email.contact[0];
      return `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() || 'Inconnu';
    }
    return 'Inconnu';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">📊 Tableau de bord — AutoFollowUp</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg bg-white border p-4 text-center shadow-sm">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-sm text-gray-600">Emails totaux</div>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-700">{sent}</div>
          <div className="text-sm text-green-700">Envoyés</div>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-700">{failed}</div>
          <div className="text-sm text-red-700">Échoués</div>
        </div>
        <div className="rounded-lg bg-gray-50 border p-4 text-center shadow-sm">
          <div className="text-2xl font-bold">{queued}</div>
          <div className="text-sm text-gray-700">En attente</div>
        </div>
      </div>

      {/* Autres infos */}
      <div className="bg-white rounded-lg border p-4 space-y-2 shadow-sm">
        <p>
          <strong>Taux d'échec :</strong> {failRate}%
        </p>
        {last ? (
          <>
            <p>
              <strong>Dernier envoi :</strong>{' '}
              {new Date(last.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Contact :</strong> {getContactName(last)}
            </p>
          </>
        ) : (
          <p>Aucun email encore envoyé.</p>
        )}
      </div>

      {/* Lien vers l'historique */}
      <div className="text-center mt-6">
        <Link
          href="/sent"
          className="inline-block rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 shadow-sm transition"
        >
          Voir l'historique complet →
        </Link>
      </div>
    </div>
  );
}
