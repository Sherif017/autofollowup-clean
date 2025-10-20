import { Resend } from 'resend';

// Vérifie que ta clé Resend est bien définie dans ton .env.local
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('❌ RESEND_API_KEY manquante dans les variables d’environnement');
}

// Crée et exporte une instance prête à l’emploi
export const resend = new Resend(resendApiKey);
