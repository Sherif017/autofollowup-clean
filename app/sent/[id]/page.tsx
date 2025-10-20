import { getServerSupabase } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { resendEmail } from '@/app/actions/resendEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function SentDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: email, error } = await supabase
    .from('sent_email')
    .select('*, contact:contact_id (email, first_name, last_name)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !email) {
    console.error('❌ Erreur lors du chargement du mail :', error);
    notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Lien retour */}
      <Link
        href="/sent"
        className="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        ← Retour à l’historique
      </Link>

      {/* En-tête du message */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          ✉️ {email.subject}
        </h1>

        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>
            <strong>À :</strong>{' '}
            {email.contact.first_name} {email.contact.last_name}{' '}
            <span className="text-gray-500">({email.contact.email})</span>
          </p>

          <p>
            <strong>Envoyé le :</strong>{' '}
            {new Date(email.sent_at ?? email.created_at).toLocaleString('fr-FR', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </p>

          <p>
            <strong>Statut :</strong>{' '}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                email.status === 'sent'
                  ? 'bg-green-100 text-green-700'
                  : email.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {email.status === 'sent' && '✅ Envoyé'}
              {email.status === 'failed' && '❌ Échec'}
              {email.status === 'queued' && '⏳ En attente'}
            </span>
          </p>
        </div>

        <hr className="my-5 border-gray-200" />

        {/* Corps du message */}
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-800 font-sans">
            {email.body_text}
          </pre>
        </div>

        {email.error && (
          <div className="mt-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
            <strong>Erreur d’envoi :</strong> {email.error}
          </div>
        )}

        {/* Bouton de renvoi */}
        <form action={resendEmail.bind(null, email.id)} className="mt-6">
          <button
            type="submit"
            className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 text-sm"
          >
            🔄 Renvoyer cet email
          </button>
        </form>
      </div>

      <div className="text-center mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} AutoFollowUp — Email IA automatisé
      </div>
    </div>
  );
}
