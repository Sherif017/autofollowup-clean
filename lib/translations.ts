export const translations = {
  fr: {
    header: {
      title: '🔧 AutoFollowUp',
      subtitle: 'Aide-nous à créer l\'outil parfait pour les artisans'
    },
    questions: [
      {
        id: 'profile',
        title: '1. Quel est ton profil ?',
        options: [
          { value: 'Indépendant', label: 'Artisan indépendant', desc: 'Travaillant seul' },
          { value: 'TPE (2-5 personnes)', label: 'Petite équipe (2-5 personnes)', desc: 'Quelques salariés ou apprentis' },
          { value: 'PME (5+ personnes)', label: 'PME (5+ personnes)', desc: 'Équipe établie' }
        ]
      },
      {
        id: 'profession',
        title: '2. Quel est ton métier d\'artisan ?',
        options: [
          { value: 'Électricien', label: '⚡ Électricien' },
          { value: 'Plombier', label: '💧 Plombier' },
          { value: 'Chauffagiste', label: '🔥 Chauffagiste' },
          { value: 'Carreleur', label: '🧱 Carreleur' },
          { value: 'Peintre', label: '🎨 Peintre' },
          { value: 'Autre', label: 'Autre métier' }
        ]
      },
      {
        id: 'rdv_method',
        title: '3. Comment gères-tu actuellement tes rendez-vous ?',
        desc: 'Sois honnête 😊',
        options: [
          { value: 'Calendrier papier / Post-its', label: 'Calendrier papier / Post-its' },
          { value: 'Téléphone / SMS uniquement', label: 'Téléphone / SMS uniquement' },
          { value: 'Google Calendar / Excel', label: 'Google Calendar / Excel' },
          { value: 'Outlook / Outil professionnel', label: 'Outlook / Outil professionnel' }
        ]
      },
      {
        id: 'time',
        title: '4. Combien de temps passes-tu par semaine sur :',
        desc: 'Estime approximativement (en heures)',
        fields: [
          { key: 'time_rdv', label: 'Gérer les rendez-vous (confirmations, rappels, modifications)' },
          { key: 'time_relance', label: 'Relancer les clients inactifs / prospection' },
          { key: 'time_devis', label: 'Créer des devis / factures' }
        ],
        placeholder: 'Heures/semaine'
      },
      {
        id: 'pain_points',
        title: '5. Quels sont tes plus gros problèmes actuellement ?',
        desc: 'Sélectionne tout ce qui s\'applique',
        options: [
          { value: 'Oublier des RDV ou les annuler', label: 'Oublier des RDV ou les annuler sans prévenir' },
          { value: 'Difficultés à relancer les prospects', label: 'Difficultés à relancer les prospects (trop de manuels)' },
          { value: 'Lenteur pour créer les devis', label: 'Lenteur pour créer les devis' },
          { value: 'Données clients dispersées', label: 'Données clients dispersées (téléphone, emails, notes partout)' },
          { value: 'Perdre des leads prospects', label: 'Perdre des leads / prospects qui ne se concrétisent pas' },
          { value: 'Pas de suivi financier clair', label: 'Pas de suivi financier clair (combien j\'ai gagné cette semaine?)' }
        ]
      },
      {
        id: 'tools',
        title: '6. Quels outils utilises-tu actuellement ?',
        desc: 'Sélectionne tout ce que tu utilises',
        options: [
          { value: 'Google (Gmail, Calendar, Drive)', label: 'Google (Gmail, Calendar, Drive)' },
          { value: 'Microsoft (Outlook, Teams)', label: 'Microsoft (Outlook, Teams)' },
          { value: 'WhatsApp / Signal', label: 'WhatsApp / Signal' },
          { value: 'Un CRM (Hubspot, Pipedrive, etc)', label: 'Un CRM (Hubspot, Pipedrive, etc)' },
          { value: 'Logiciel facturation/compta', label: 'Logiciel facturation/compta' },
          { value: 'Papier et stylo principalement', label: 'Papier et stylo principalement' }
        ]
      },
      {
        id: 'features',
        title: '7. Qu\'est-ce qui serait vraiment utile pour toi ?',
        desc: 'Sélectionne les 3 choses les plus importantes',
        options: [
          { value: 'Calendrier + rappels RDV automatiques', label: 'Calendrier + rappels RDV automatiques (SMS/email)' },
          { value: 'Base de données clients centralisée', label: 'Base de données clients centralisée' },
          { value: 'Génération devis rapide', label: 'Génération devis rapide (templates)' },
          { value: 'Relances auto pour inactifs', label: 'Relances auto pour clients inactifs' },
          { value: 'Dashboard stats / CA', label: 'Dashboard stats / CA (combien j\'ai gagné)' },
          { value: 'Application mobile', label: 'Application mobile' },
          { value: 'Import contacts en masse', label: 'Import contacts en masse (CSV)' }
        ]
      },
      {
        id: 'price',
        title: '8. Quel prix serais-tu prêt à payer ?',
        desc: 'Pour un outil CRM + gestion RDV + relances (par mois)',
        options: [
          { value: 'Gratuit seulement', label: 'Gratuit seulement' },
          { value: '€9-19/mois', label: '€9-19/mois' },
          { value: '€20-39/mois', label: '€20-39/mois' },
          { value: '€40-59/mois', label: '€40-59/mois' },
          { value: '€60+/mois', label: '€60+/mois' }
        ]
      },
      {
        id: 'objections',
        title: '9. Qu\'est-ce qui t\'empêcherait d\'utiliser cet outil ?',
        placeholder: 'Sois sincère... (trop compliqué? peu fiable? autre?)'
      },
      {
        id: 'contact',
        title: '10. Dernière chose : tes coordonnées',
        desc: 'Pour te contacter si besoin, et t\'offrir accès prioritaire à la beta',
        fields: [
          { key: 'first_name', label: 'Ton prénom', placeholder: 'Ex: Jean', required: true },
          { key: 'company', label: 'Nom de ton entreprise (optionnel)', placeholder: 'Ex: Électricité Martin', required: false },
          { key: 'phone', label: 'Téléphone', placeholder: 'Ex: +33 6 12 34 56 78', required: true },
          { key: 'email', label: 'Email', placeholder: 'Ex: jean@example.com', required: true }
        ]
      }
    ],
    buttons: {
      previous: '← Précédent',
      next: 'Suivant →',
      submit: 'Envoyer ✓'
    },
    success: {
      title: 'Merci beaucoup ! 🙏',
      message: 'Tes réponses nous ont beaucoup aidé.',
      follow: 'Tu recevras très bientôt un accès prioritaire à AutoFollowUp.',
      closing: 'À bientôt ! 🚀'
    },
    placeholders: {
      required: 'Veuillez répondre à cette question avant de continuer.'
    },
    stepCounter: 'sur'
  },
  en: {
    header: {
      title: '🔧 AutoFollowUp',
      subtitle: 'Help us create the perfect tool for craftspeople'
    },
    questions: [
      {
        id: 'profile',
        title: '1. What is your profile?',
        options: [
          { value: 'Self-employed', label: 'Self-employed tradesperson', desc: 'Working alone' },
          { value: 'Small team (2-5 people)', label: 'Small team (2-5 people)', desc: 'Few employees or apprentices' },
          { value: 'SME (5+ people)', label: 'SME (5+ people)', desc: 'Established team' }
        ]
      },
      {
        id: 'profession',
        title: '2. What is your trade?',
        options: [
          { value: 'Electrician', label: '⚡ Electrician' },
          { value: 'Plumber', label: '💧 Plumber' },
          { value: 'Heating engineer', label: '🔥 Heating engineer' },
          { value: 'Tiler', label: '🧱 Tiler' },
          { value: 'Painter', label: '🎨 Painter' },
          { value: 'Other', label: 'Other trade' }
        ]
      },
      {
        id: 'rdv_method',
        title: '3. How do you currently manage your appointments?',
        desc: 'Be honest 😊',
        options: [
          { value: 'Paper calendar / Post-its', label: 'Paper calendar / Post-its' },
          { value: 'Phone / SMS only', label: 'Phone / SMS only' },
          { value: 'Google Calendar / Excel', label: 'Google Calendar / Excel' },
          { value: 'Outlook / Professional tool', label: 'Outlook / Professional tool' }
        ]
      },
      {
        id: 'time',
        title: '4. How much time do you spend per week on:',
        desc: 'Estimate approximately (in hours)',
        fields: [
          { key: 'time_rdv', label: 'Managing appointments (confirmations, reminders, changes)' },
          { key: 'time_relance', label: 'Following up with inactive clients / prospecting' },
          { key: 'time_devis', label: 'Creating quotes / invoices' }
        ],
        placeholder: 'Hours/week'
      },
      {
        id: 'pain_points',
        title: '5. What are your biggest problems right now?',
        desc: 'Select all that apply',
        options: [
          { value: 'Forgetting or cancelling appointments', label: 'Forgetting or cancelling appointments without warning' },
          { value: 'Difficulty following up with prospects', label: 'Difficulty following up with prospects (too manual)' },
          { value: 'Slow quote creation', label: 'Slow quote creation' },
          { value: 'Client data scattered', label: 'Client data scattered (phone, emails, notes everywhere)' },
          { value: 'Losing leads', label: 'Losing leads / prospects that don\'t convert' },
          { value: 'No clear financial tracking', label: 'No clear financial tracking (how much did I earn this week?)' }
        ]
      },
      {
        id: 'tools',
        title: '6. What tools do you currently use?',
        desc: 'Select all that apply',
        options: [
          { value: 'Google (Gmail, Calendar, Drive)', label: 'Google (Gmail, Calendar, Drive)' },
          { value: 'Microsoft (Outlook, Teams)', label: 'Microsoft (Outlook, Teams)' },
          { value: 'WhatsApp / Signal', label: 'WhatsApp / Signal' },
          { value: 'A CRM (Hubspot, Pipedrive, etc)', label: 'A CRM (Hubspot, Pipedrive, etc)' },
          { value: 'Accounting/invoicing software', label: 'Accounting/invoicing software' },
          { value: 'Paper and pen mainly', label: 'Paper and pen mainly' }
        ]
      },
      {
        id: 'features',
        title: '7. What would be really useful for you?',
        desc: 'Select the 3 most important things',
        options: [
          { value: 'Calendar + automatic appointment reminders', label: 'Calendar + automatic appointment reminders (SMS/email)' },
          { value: 'Centralized client database', label: 'Centralized client database' },
          { value: 'Fast quote generation', label: 'Fast quote generation (templates)' },
          { value: 'Auto follow-ups for inactive clients', label: 'Auto follow-ups for inactive clients' },
          { value: 'Dashboard stats / Revenue', label: 'Dashboard stats / Revenue (how much did I earn)' },
          { value: 'Mobile app', label: 'Mobile app' },
          { value: 'Bulk contact import', label: 'Bulk contact import (CSV)' }
        ]
      },
      {
        id: 'price',
        title: '8. What price would you be willing to pay?',
        desc: 'For a CRM tool + appointment management + follow-ups (per month)',
        options: [
          { value: 'Free only', label: 'Free only' },
          { value: '$9-19/month', label: '$9-19/month' },
          { value: '$20-39/month', label: '$20-39/month' },
          { value: '$40-59/month', label: '$40-59/month' },
          { value: '$60+/month', label: '$60+/month' }
        ]
      },
      {
        id: 'objections',
        title: '9. What would prevent you from using this tool?',
        placeholder: 'Be honest... (too complicated? unreliable? other?)'
      },
      {
        id: 'contact',
        title: '10. Last thing: your contact information',
        desc: 'So we can contact you if needed, and give you priority access to the beta',
        fields: [
          { key: 'first_name', label: 'Your first name', placeholder: 'Ex: John', required: true },
          { key: 'company', label: 'Your company name (optional)', placeholder: 'Ex: Smith Electrical', required: false },
          { key: 'phone', label: 'Phone', placeholder: 'Ex: +1 (555) 123-4567', required: true },
          { key: 'email', label: 'Email', placeholder: 'Ex: john@example.com', required: true }
        ]
      }
    ],
    buttons: {
      previous: '← Previous',
      next: 'Next →',
      submit: 'Submit ✓'
    },
    success: {
      title: 'Thank you so much! 🙏',
      message: 'Your answers have helped us a lot.',
      follow: 'You will receive priority access to AutoFollowUp very soon.',
      closing: 'See you soon! 🚀'
    },
    placeholders: {
      required: 'Please answer this question before continuing.'
    },
    stepCounter: 'of'
  }
};

export type Language = 'fr' | 'en';