import { createClient } from '@supabase/supabase-js';

type Contact = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  status: string;
  created_at: string;
};

export default async function Home() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: contacts, error } = await supabase
    .from('contact')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur Supabase:', error.message);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">AutoFollowUp — Mini CRM</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          Erreur : {error.message}
        </div>
      )}
      <ul className="space-y-3">
        {contacts?.map((c: Contact) => (
          <li key={c.id} className="border rounded p-3">
            <div className="font-medium">
              {c.first_name ?? ''} {c.last_name ?? ''}
            </div>
            <div className="text-sm text-gray-600">{c.email}</div>
            <div className="text-xs mt-1">
              Statut : <span className="font-semibold">{c.status}</span>
            </div>
          </li>
        ))}
      </ul>
      {!contacts?.length && (
        <p className="text-gray-500 mt-4">Aucun contact trouvé.</p>
      )}
    </main>
  );
}
