'use server';
import { getServerSupabase } from '@/utils/supabase/server';
import { resend } from '@/utils/email/resend';

export async function sendDraft(draftId: string) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Erreur getUser:', userError);
    return { success: false, error: 'Connexion requise' };
  }

  const { data: draft, error: draftError } = await supabase
    .from('draft_email')
    .select('*, contact:contact_id (id, email, first_name, last_name)')
    .eq('id', draftId)
    .eq('user_id', user.id)
    .single();

  if (draftError || !draft) {
    console.error('Erreur récupération brouillon:', draftError);
    return { success: false, error: 'Brouillon introuvable' };
  }

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: draft.contact.email,
      subject: draft.subject,
      html: `<pre style="font-family: sans-serif;">${draft.body_text}</pre>`,
    });

    const { error: logError } = await supabase.from('sent_email').insert({
      draft_id: draft.id,
      contact_id: draft.contact.id,
      subject: draft.subject,
      body_text: draft.body_text,
      status: 'sent',
      provider_name: 'resend',
      provider_message_id: response.data?.id ?? null,
      sent_at: new Date().toISOString(),
      user_id: user.id,
    });

    if (logError) {
      console.error('Erreur insertion sent_email:', logError);
    }

    // ✅ Retourner l'objet au lieu de redirect
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error: any) {
    console.error('Erreur Resend:', error);

    await supabase.from('sent_email').insert({
      draft_id: draft.id,
      contact_id: draft.contact.id,
      subject: draft.subject,
      body_text: draft.body_text,
      status: 'failed',
      provider_name: 'resend',
      error: error.message ?? 'Erreur inconnue',
      user_id: user.id,
    });

    // ✅ Retourner l'erreur au lieu de redirect
    return { success: false, error: 'Échec de l\'envoi' };
  }
}