import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import SubmitButton from '../components/SubmitButton';
import { getServerSupabase } from '../utils/supabase/server';
import ContactListClient from '../components/ContactListClient';
import { sendDraft } from './actions/sendDraft';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export type Contact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  status: 'lead' | 'prospect' | 'client' | 'perdu';
  created_at: string;
};

export type Draft = {
  id: string;
  contact_id: string;
  subject: string;
  body_text: string;
  created_at: string;
};

// petite validation d'email
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** ---------- Server Actions ---------- */
export async function addContact(formData: FormData) {
  'use server';
  const supabase = await getServerSupabase();

  const first_name = String(formData.get('first_name') || '').trim();
  const last_name = String(formData.get('last_name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const rawStatus = String(formData.get('status') || 'lead').trim();
  const status: Contact['status'] =
    ['lead', 'prospect', 'client', 'perdu'].includes(rawStatus as any)
      ? (rawStatus as Contact['status'])
      : 'lead';

  if (!email || !isValidEmail(email)) {
    redirect('/?toast=error_invalid_email');
  }

  const { error } = await supabase
    .from('contact')
    .insert({ first_name, last_name, email, status });

  if (error) redirect('/?toast=error_generic');

  revalidatePath('/');
  redirect('/?toast=contact_added');
}

export async function deleteContact(id: string) {
  'use server';
  const supabase = await getServerSupabase();

  const { error } = await supabase.from('contact').delete().eq('id', id);
  if (error) redirect('/?toast=error_generic');

  revalidatePath('/');
  redirect('/?toast=contact_deleted');
}

/** IA – génère un brouillon et l’enregistre dans draft_email */
export async function generateFollowup(contactId: string) {
  'use server';
  const supabase = await getServerSupabase();

  // Récupère le contact (protégé par RLS)
  const { data: c } = await supabase
    .from('contact')
    .select('*')
    .eq('id', contactId)
    .single();

  if (!c) redirect('/?toast=error_generic');

  // Import dynamique OpenAI
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
      { role: 'user', content: user },
    ],
    temperature: 0.4,
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
    body_text,
  });

  if (insErr) redirect('/?toast=error_generic');

  revalidatePath('/');
  redirect('/?toast=draft_created');
}

/** ---------- Page principale ---------- */
export default async function Home() {
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-0">
        <h1 className="text-2xl font-semibold mb-3">AutoFollowUp — Mini CRM</h1>
        <p className="text-gray-700 mb-4">Tu dois être connecté pour voir tes contacts.</p>
        <a href="/login" className="underline text-blue-600 hover:text-blue-800">
          Se connecter / Créer un compte
        </a>
      </main>
    );
  }

  const { data: contacts, error } = await supabase
    .from('contact')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: drafts } = await supabase
    .from('draft_email')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="p-0 space-y-6">
      {/* ---- Titre + boutons Import / Export ---- */}
      <div className="flex flex-wrap justify-between items-center mb-2 gap-3">
        <div>
          <h1 className="text-2xl font-semibold">AutoFollowUp — Mini CRM</h1>
          <p className="text-gray-700 mt-1 text-sm">
            Ajoute ou gère tes contacts, génère des relances IA, importe ou exporte des listes CSV.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/api/export-contacts"
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 shadow-sm transition"
          >
            ⬇️ Exporter mes contacts
          </a>

          <a
            href="/import"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 shadow-sm transition"
          >
            📤 Importer un fichier CSV
          </a>
        </div>
      </div>

      {/* ---- Formulaire d'ajout ---- */}
      <section className="border rounded p-4 bg-white shadow-sm">
        <h2 className="font-medium mb-3">Nouveau contact</h2>
        <form action={addContact} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600">Prénom</label>
            <input
              name="first_name"
              type="text"
              placeholder="Lina"
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Nom</label>
            <input
              name="last_name"
              type="text"
              placeholder="Martin"
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Email *</label>
            <input
              name="email"
              type="email"
              required
              placeholder="lina@example.com"
              className="mt-1 w-full rounded border p-2"
            />
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
            <SubmitButton
              idleLabel="Ajouter"
              pendingLabel="Ajout…"
              className="bg-black text-white hover:bg-gray-800"
            />
          </div>
        </form>
      </section>

      {error && (
        <div className="p-3 border border-red-300 text-red-700 rounded bg-white">
          Erreur de lecture : {error.message}
        </div>
      )}

      {/* ---- Liste filtrable + brouillons IA ---- */}
      <ContactListClient
        contacts={(contacts ?? []) as Contact[]}
        drafts={(drafts ?? []) as Draft[]}
        onGenerate={generateFollowup}
        onDelete={deleteContact}
        onSend={sendDraft}
      />
    </main>
  );
}
