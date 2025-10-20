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
    .select(
      'id, subject, status, created_at, contact:contact_id (email, first_name, last_name)'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return <div className="p-6 text-red-600">Erreur chargement des envois.</div>;
  }

  type SentEmail = {
    id: string;
    subject: string;
    status: string;
    created_at: string;
    contact: Array<{
      email: string;
      first_name: string;
      last_name: string;
    }> | null;
  };

  const typedEmails = (sentEmails as SentEmail[]) || [];

  // DEBUG : Affiche la structure des données reçues
  console.log('=== DEBUG SENT EMAILS ===');
  console.log('Total emails:', typedEmails.length);
  typedEmails.forEach((mail, index) => {
    console.log(`Email ${index}:`, {
      id: mail.id,
      subject: mail.subject,
      contact: mail.contact,
      contactType: typeof mail.contact,
      contactIsArray: Array.isArray(mail.contact),
      contactLength: Array.isArray(mail.contact) ? mail.contact.length : 'N/A',
    });
  });
  console.log('=== FIN DEBUG ===');

  const getContactInfo = (contact: any) => {
    // Gérer le cas où contact est null ou undefined
    if (!contact) {
      return { name: 'Inconnu', email: '' };
    }

    // Si c'est un array, prendre le premier élément
    const contactData = Array.isArray(contact) ? contact[0] : contact;

    // Vérifier que contactData existe et a les propriétés nécessaires
    if (!contactData || !contactData.first_name || !contactData.last_name) {
      return { name: 'Inconnu', email: contactData?.email || '' };
    }

    return {
      name: `${contactData.first_name} ${contactData.last_name}`,
      email: contactData.email || '',
    };
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Historique des envois 📬</h1>
      {!typedEmails.length && (
        <p className="text-gray-600">Aucun email envoyé pour l'instant.</p>
      )}
      <ul className="space-y-2">
        {typedEmails.map((mail) => {
          const contactInfo = getContactInfo(mail.contact);
          return (
            <li key={mail.id}>
              <details className="border rounded bg-white">
                <summary className="cursor-pointer p-3 hover:bg-gray-50 flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="font-semibold">{mail.subject}</div>
                    <div className="text-sm text-gray-600">
                      À : {contactInfo.name} {contactInfo.email && `(${contactInfo.email})`}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                      mail.status === 'sent'
                        ? 'bg-green-100 text-green-700'
                        : mail.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {mail.status}
                  </span>
                </summary>
                <div className="border-t p-3 bg-gray-50 space-y-2">
                  <div className="text-xs text-gray-500">
                    {new Date(mail.created_at).toLocaleString()}
                  </div>
                  <Link
                    href={`/sent/${mail.id}`}
                    className="inline-block text-xs text-blue-600 hover:underline"
                  >
                    Voir détails →
                  </Link>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}