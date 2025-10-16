import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import DeleteButton from '../Components/DeleteButton';

type Contact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  status: 'lead' | 'prospect' | 'client' | 'perdu';
  created_at: string;
};

/** ---------- helpers ---------- */
function getSupabase() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

/** ---------- Server Actions ---------- */
export async function addContact(formData: FormData) {
  'use server';

  const first_name = String(formData.get('first_name') || '').trim();
  const last_name = String(formData.get('last_name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const status = (String(formData.get('status') || 'lead') as Contact['status']);

  if (!email || !email.includes('@')) return;

  const supabase = getSupabase();
  await supabase.from('contact').insert({ first_name, last_name, email, status });

  revalidatePath('/');
}

export async function deleteContact(id: string) {
  'use server';

  const supabase = getSupabase();
  await supabase.from('contact').delete().eq('id', id);

  revalidatePath('/');
}

/** ---------- Page principale ---------- */
export default async function Home() {
  const supabase = getSupabase();

  const { data: contacts, error } = await supabase
    .from('contact')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">AutoFollowUp — Mini CRM</h1>
      <p className="text-gray-700 mt-2">
        Ajoute des contacts et supprime-les. La liste se met à jour automatiquement.
      </p>

      {/* ---- Formulaire d'ajout ---- */}
      <section className="mt-6 border rounded p-4">
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
            <button
              type="submit"
              className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800"
            >
              Ajouter
            </button>
          </div>
        </form>
      </section>

      {/* ---- Messages d'erreur de lecture ---- */}
      {error && (
        <div className="mt-4 p-3 border border-red-300 text-red-700 rounded">
          Erreur de lecture : {error.message}
        </div>
      )}

      {/* ---- Liste des contacts ---- */}
      <ul className="mt-6 space-y-3">
        {(contacts as Contact[] | null)?.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">
                  {c.first_name ?? ''} {c.last_name ?? ''}
                </div>
                <div className="text-sm text-gray-600">{c.email}</div>
                <div className="text-xs mt-1">
                  Statut : <span className="font-semibold">{c.status}</span>
                </div>
              </div>

              {/* ---- Bouton Supprimer (client) avec confirmation ---- */}
              <DeleteButton
                action={deleteContact.bind(null, c.id)}
                confirmText={`Voulez-vous vraiment supprimer le contact ${
                  c.first_name ?? ''
                } ${c.last_name ?? ''} ?`}
              />
            </div>
          </li>
        ))}

        {!contacts?.length && (
          <li className="text-gray-600">Aucun contact pour le moment.</li>
        )}
      </ul>
    </main>
  );
}
