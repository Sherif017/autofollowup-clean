import { getServerSupabase } from '@/utils/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function SentPage() {
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

  const { data: sentEmails, error } = await supabase
    .from('sent_email')
    .select('id, subject, status, created_at, contact:contact_id (email, first_name, last_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return <div className="p-6 text-red-600">Erreur chargement des envois.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Historique des envois 📬</h1>

      {!sentEmails?.length && (
        <p className="text-gray-600">Aucun email envoyé pour l’instant.</p>
      )}

      <ul className="space-y-3">
        {sentEmails?.map((mail) => (
          <li
            key={mail.id}
            className="border rounded p-3 bg-white flex justify-between items-start"
          >
            <div>
              <div className="font-medium">{mail.subject}</div>
              <div className="text-sm text-gray-600">
                À : {mail.contact?.first_name ?? ''} {mail.contact?.last_name ?? ''} (
                {mail.contact?.email})
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(mail.created_at).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  mail.status === 'sent'
                    ? 'bg-green-100 text-green-700'
                    : mail.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {mail.status}
              </span>

              <Link
                href={`/sent/${mail.id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                Voir
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
