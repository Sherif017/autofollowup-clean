import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/utils/supabase/server';
import Papa from 'papaparse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactCSV = {
  first_name?: string;
  last_name?: string;
  email: string;
  status?: string;
};

/**
 * Import CSV de contacts pour l’utilisateur connecté
 */
export async function POST(req: Request) {
  try {
    const supabase = await getServerSupabase();

    // 1️⃣ Vérifie la session utilisateur
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Non autorisé.' },
        { status: 401 }
      );
    }

    // 2️⃣ Récupère le CSV depuis la requête
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { message: 'Aucun fichier fourni.' },
        { status: 400 }
      );
    }

    const text = await file.text();

    // 3️⃣ Parse le CSV en objets
    const parsed = Papa.parse<ContactCSV>(text, {
      header: true,
      skipEmptyLines: true,
    });

    const contacts = parsed.data.filter((c) => c.email?.trim());

    if (!contacts.length) {
      return NextResponse.json(
        { message: 'Aucun contact valide trouvé.' },
        { status: 400 }
      );
    }

    // 4️⃣ Récupère les emails existants pour éviter les doublons
    const { data: existing, error: existingErr } = await supabase
      .from('contact')
      .select('email')
      .eq('user_id', user.id);

    if (existingErr) {
      console.error('Erreur récupération existants:', existingErr);
      return NextResponse.json(
        { message: 'Erreur de lecture existants.' },
        { status: 500 }
      );
    }

    const existingSet = new Set((existing ?? []).map((e) => e.email));

    // 5️⃣ Filtre uniquement les nouveaux contacts
    const newContacts = contacts.filter(
      (c: ContactCSV) => !existingSet.has(c.email)
    );

    if (!newContacts.length) {
      return NextResponse.json(
        { message: 'Tous les contacts existent déjà.' },
        { status: 200 }
      );
    }

    // 6️⃣ Insère les nouveaux contacts
    const { error: insertErr } = await supabase.from('contact').insert(
      newContacts.map((c) => ({
        first_name: c.first_name?.trim() || null,
        last_name: c.last_name?.trim() || null,
        email: c.email.trim(),
        status: (c.status as 'lead' | 'prospect' | 'client' | 'perdu') || 'lead',
        user_id: user.id,
      }))
    );

    if (insertErr) {
      console.error('Erreur insertion:', insertErr);
      return NextResponse.json(
        { message: 'Erreur lors de l’insertion.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Import terminé : ${newContacts.length} contacts ajoutés.`,
    });
  } catch (error) {
    console.error('Erreur import CSV:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
