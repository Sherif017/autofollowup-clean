'use server';

import { getServerSupabase } from '@/utils/supabase/server';
import { resend } from '@/utils/email/resend';
import { redirect } from 'next/navigation';

export async function resendEmail(sentId: string) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?toast=Connexion requise');
  }

  // Récupérer le mail existant
  const { data: email, error } = await supabase
    .from('sent_email')
    .select('*, contact:contact_id (email, first_name, last_name)')
    .eq('id', sentId)
    .eq('user_id', user.id)
    .single();

  if (error || !email) {
    console.error('Erreur lors du chargement du mail:', error);
    redirect('/sent?toast=Email%20introuvable');
  }

  try {
    // Renvoyer le mail via Resend
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email.contact.email,
      subject: email.subject,
      html: `<pre style="font-family: sans-serif;">${email.body_text}</pre>`,
    });

    // Enregistrer un nouveau log
    const { error: insertError } = await supabase.from('sent_email').insert({
      draft_id: email.draft_id ?? null,
      contact_id: email.contact_id,
      subject: email.subject,
      body_text: email.body_text,
      status: 'sent',
      provider_name: 'resend',
      provider_message_id: response.data?.id ?? null,
      sent_at: new Date().toISOString(),
      user_id: user.id,
    });

    if (insertError) console.error('Erreur insertion resend:', insertError);

    redirect(`/sent/${sentId}?toast=Email%20renvoyé%20avec%20succès`);
  } catch (err: any) {
    console.error('Erreur Resend (relance):', err);

    await supabase.from('sent_email').insert({
      draft_id: email.draft_id ?? null,
      contact_id: email.contact_id,
      subject: email.subject,
      body_text: email.body_text,
      status: 'failed',
      provider_name: 'resend',
      error: err.message ?? 'Erreur inconnue',
      user_id: user.id,
    });

    redirect(`/sent/${sentId}?toast=Échec%20du%20renvoi`);
  }
}
