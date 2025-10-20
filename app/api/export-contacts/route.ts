import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Route d’export CSV : /api/export-contacts
 * ➤ Télécharge les contacts de l’utilisateur connecté sous forme de fichier CSV
 */
export async function GET() {
  try {
    // 1️⃣ Récupération du client Supabase côté serveur
    const supabase = await getServerSupabase();

    // 2️⃣ Vérifie la session utilisateur
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Non autorisé.' },
        { status: 401 }
      );
    }

    // 3️⃣ Récupère tous les contacts liés à l’utilisateur
    const { data, error } = await supabase
      .from('contact')
      .select('first_name, last_name, email, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      return NextResponse.json(
        { message: 'Erreur lors de la récupération des contacts.' },
        { status: 500 }
      );
    }

    // 4️⃣ Si aucun contact
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: 'Aucun contact à exporter.' },
        { status: 404 }
      );
    }

    // 5️⃣ Génère le contenu CSV
    const headers = ['first_name', 'last_name', 'email', 'status', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...data.map((c) =>
        [
          c.first_name || '',
          c.last_name || '',
          c.email || '',
          c.status || 'lead',
          c.created_at ? new Date(c.created_at).toISOString() : '',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    // 6️⃣ Retourne le CSV en téléchargement
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=contacts_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`,
      },
    });
  } catch (error) {
    console.error('Erreur export CSV:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
