import { revalidatePath } from 'next/cache';
import DeleteButton from '../components/DeleteButton';
import RelanceButton from '../components/RelanceButton';
import { getServerSupabase } from '../utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // ou: export const revalidate = 0;

type Contact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  status: 'lead' | 'prospect' | 'client' | 'perdu';
  created_at: string;
};

type Draft = {
  id: string;
  contact_id: string;
  subject: string;
  body_text: string;
  created_at: string;
};

/** ---------- Server Actions ---------- */
export async function addContact(formData: FormData) {
  'use server';
  const supabase = await getServerSupabase();

  const first_name = String(formData.get('first_name') || '').trim();
  const last_name = String(formData.get('last_name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const status = (String(formData.get('status') || 'lead') as Contact['status']);

  if (!email || !email.includes('@')) return;

  const { error } = await supabase
    .from('contact')
    .insert({ first_name, last_name, email, status });

  if (error) throw new Error(error.message);

  revalidatePath('/');
}

export async function deleteContact(id: string) {
  'use server';
  const supabase = await getServerSupabase();

  const { error } = await supabase
    .from('contact')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
}

/** IA – génère un brouillon et l’enregistre dans draft_email */
export async function generateFollowup(contactId: string) {
  'use server';
  const supabase = await getServerSupabase();

  // Récupère le contact (protégé par RLS)
  const { data: c, error: getErr } = await supabase
    .from('contact')
    .select('*')
    .eq('id', contactId)
    .single();

  if (getErr || !c) return;

  // Import dynamique pour éviter les soucis de build
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const system = `Tu génères des emails de relance brefs (4-7 lignes), polis et orientés action.
- Langue: français.
- Ton: professionnel, chaleureux.
- Inclure un appel à l'action clair (ex: proposer un créneau).
- Ne pas inventer de faits. Pas de jargon.`;

  const user = `Détails contact:
- Nom: ${c.first_name ?? ''} ${c.last_name ?? ''}
- Email: ${c.email}
- Statut: ${c.status}

Contexte:
Je suis freelance/consultant, je relance suite à un premier échange/proposition.
Objectif: obtenir une réponse (oui/non), idéalement un court call.

Rends l'email PERSONNALISÉ (salut + nom si possible), concis, et avec une phrase de valeur. Donne un sujet et le corps en texte brut.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.4
  });

  const text = resp.choices[0]?.message?.content ?? '';
  let subject = 'Petit suivi';
  let body_text = text;

  const m1 = text.match(/sujet\s*:?\s*(.+)/i);
  if (m1) subject = m1[1].trim();

  const m2 = text.match(/corps\s*:?\s*([\s\S]+)/i);
  if (m2) body_text = m2[1].trim();

  const { error: insErr } = await supabase.from('draft_email').insert({
    contact_id: contactId,
    subject,
    body_text
  });

  if (insErr) throw new Error(insErr.message);

  revalidatePath('/');
}

/** ---------- Page (exige la connexion) ---------- */
export default async function Home() {
  const supabase = await getServerSupabase();

  // 1) Vérifie l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-3">AutoFollowUp — Mini CRM</h1>
        <p className="text-gray-700 mb-4">
          Tu dois être connecté pour voir tes contacts.
        </p>
        <a
          href="/login"
          className="underline text-blue-600 hover:text-blue-800"
        >
          Se connecter / Créer un compte
        </a>
      </main>
    );
  }

  // 2) Lis les données protégées par RLS (uniquement celles du user)
  const { data: contacts, error } = await supabase
    .from('contact')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: drafts } = await supabase
    .from('draft_email')
    .select('*')
    .order('created_at', { ascending: false });

  const lastDraftByContact = new Map<string, Draft>();
  (drafts ?? []).forEach((d) => {
    if (!lastDraftByContact.has(d.contact_id)) {
      lastDraftByContact.set(d.contact_id, d as Draft);
    }
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">AutoFollowUp — Mini CRM</h1>
      <p className="text-gray-700 mt-2">
        Ajoute/supprime des contacts et génère un brouillon d’email de relance par IA.
      </p>

      {/* ---- Formulaire d'ajout ---- */}
      <section className="mt-6 border rounded p-4">
        <h2 className="font-medium mb-3">Nouveau contact</h2>
        <form action={addContact} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Prénom</label>
            <input name="first_name" type="text" placeholder="Lina" className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Nom</label>
            <input name="last_name" type="text" placeholder="Martin" className="mt-1 w-full rounded border p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Email *</label>
            <input name="email" type="email" required placeholder="lina@example.com" className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Statut</label>
            <select name="status" className="mt-1 w-full rounded border p-2">
              <option value="lead">lead</option>
              <option value="prospect">prospect</option>
              <option value="client">client</option>
              <option value="perdu">perdu</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800">Ajouter</button>
          </div>
        </form>
      </section>

      {error && (
        <div className="mt-4 p-3 border border-red-300 text-red-700 rounded">
          Erreur de lecture : {error.message}
        </div>
      )}

      {/* ---- Liste des contacts + actions ---- */}
      <ul className="mt-6 space-y-4">
        {(contacts as Contact[] | null)?.map((c) => {
          const d = lastDraftByContact.get(c.id);
          return (
            <li key={c.id} className="border rounded p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{c.first_name ?? ''} {c.last_name ?? ''}</div>
                  <div className="text-sm text-gray-600">{c.email}</div>
                  <div className="text-xs mt-1">Statut : <span className="font-semibold">{c.status}</span></div>
                </div>

                <div className="flex gap-2">
                  <RelanceButton action={generateFollowup.bind(null, c.id)} />
                  <DeleteButton
                    action={deleteContact.bind(null, c.id)}
                    confirmText={`Voulez-vous vraiment supprimer le contact ${c.first_name ?? ''} ${c.last_name ?? ''} ?`}
                  />
                </div>
              </div>

              {/* Dernier brouillon affiché */}
              {d && (
                <div className="mt-3 rounded border p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-1">
                    Brouillon IA — {new Date(d.created_at).toLocaleString()}
                  </div>
                  <div className="font-semibold mb-1">Objet : {d.subject}</div>
                  <pre className="whitespace-pre-wrap text-sm">{d.body_text}</pre>
                </div>
              )}
            </li>
          );
        })}

        {!contacts?.length && <li className="text-gray-600">Aucun contact pour le moment.</li>}
      </ul>
    </main>
  );
}
