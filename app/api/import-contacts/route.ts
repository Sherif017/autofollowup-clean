import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/utils/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { contacts } = await req.json();
    const supabase = await getServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });
    }

    // Filtrer les entrées valides
    const validContacts = contacts
      .filter((c: any) => c.email)
      .map((c: any) => ({
        first_name: c.first_name || '',
        last_name: c.last_name || '',
        email: c.email.trim().toLowerCase(),
        status: c.status || 'lead',
        user_id: user.id,
      }));

    if (!validContacts.length)
      return NextResponse.json({ message: 'Aucun contact valide trouvé.' });

    // 1️⃣ Vérifier les emails déjà existants pour cet utilisateur
    const { data: existingEmails, error: existingError } = await supabase
      .from('contact')
      .select('email')
      .eq('user_id', user.id);

    if (existingError) throw existingError;

    const existingSet = new Set(
      (existingEmails || []).map((e) => e.email.toLowerCase())
    );

    const newContacts = validContacts.filter(
      (c) => !existingSet.has(c.email)
    );

    // 2️⃣ Si tout est déjà présent
    if (!newContacts.length) {
      return NextResponse.json({
        message: '⚠️ Tous les emails étaient déjà enregistrés.',
      });
    }

    // 3️⃣ Insertion des nouveaux contacts
    const { error: insertError } = await supabase.from('contact').insert(newContacts);
    if (insertError) throw insertError;

    return NextResponse.json({
      message: `✅ ${newContacts.length} contact(s) importé(s) avec succès (${validContacts.length - newContacts.length} doublon(s) ignoré(s)).`,
    });
  } catch (error) {
    console.error('Erreur Import CSV:', error);
    return NextResponse.json({ message: '❌ Erreur serveur.' }, { status: 500 });
  }
}
