import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Sauvegarder dans Supabase
    const { error } = await supabase
      .from('questionnaires')
      .insert([{
        language: data.language,
        profile: data.profile,
        profession: data.profession,
        rdv_method: data.rdv_method,
        time_rdv: data.time_rdv,
        time_relance: data.time_relance,
        time_devis: data.time_devis,
        pain_points: data.pain_points,
        tools: data.tools,
        features: data.features,
        price: data.price,
        objections: data.objections,
        first_name: data.first_name,
        company: data.company || null,
        phone: data.phone,
        email: data.email,
        submitted_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Données reçues avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}