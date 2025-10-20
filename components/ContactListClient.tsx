'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RelanceButton from './RelanceButton';
import DeleteButton from './DeleteButton';
import FilterBar from './FilterBar';
import SendButton from './SendButton';
import type { Contact, Draft } from '../app/page';

type Props = {
  contacts: Contact[];
  drafts: Draft[];
  onGenerate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSend: (draftId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
};

// ✅ Helper pour formater la date du dernier contact
function formatLastContact(date: string | null): string {
  if (!date) return 'Jamais contacté';
  
  const days = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (days === 0) return 'Aujourd\'hui';
  if (days === 1) return 'Hier';
  if (days < 30) return `Il y a ${days} jours`;
  if (days < 365) return `Il y a ${Math.floor(days / 7)} semaines`;
  return `Il y a ${Math.floor(days / 365)} ans`;
}

export default function ContactListClient({
  contacts,
  drafts,
  onGenerate,
  onDelete,
  onSend,
}: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  // Regrouper les brouillons par contact
  const draftsByContact = useMemo(() => {
    const map = new Map<string, Draft[]>();
    drafts
      .slice()
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .forEach((d) => {
        if (!map.has(d.contact_id)) map.set(d.contact_id, []);
        map.get(d.contact_id)!.push(d);
      });
    return map;
  }, [drafts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchName = (
  `${c.first_name ?? ''} ${c.last_name ?? ''} ${c.email ?? ''}`
)
  .toLowerCase()
  .includes(q);
      const matchStatus = !status || c.status === status;
      return matchName && matchStatus;
    });
  }, [contacts, query, status]);

  return (
    <>
      <div className="mt-6">
        <FilterBar onFilter={(q, s) => { setQuery(q); setStatus(s); }} />
      </div>

      <ul className="mt-4 space-y-4">
        <AnimatePresence initial={false}>
          {filtered.map((c) => {
            const draftsForContact = draftsByContact.get(c.id) || [];
            const lastDraft = draftsForContact[0];

            // ✅ Compter les emails envoyés
            const emailsSent = draftsForContact.filter(d => d.sent_at).length;

            return (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="border rounded p-3 bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium">
                      {c.first_name ?? ''} {c.last_name ?? ''}
                    </div>
                    <div className="text-sm text-gray-600">{c.email}</div>
                    <div className="text-xs mt-1">
                      Statut : <span className="font-semibold">{c.status}</span>
                    </div>

                    {/* ✅ AFFICHAGE DU DERNIER CONTACT */}
                    <div className="text-xs mt-1 text-gray-500">
                      📨 Dernier contact : {formatLastContact(c.last_contact_date)}
                    </div>

                    {/* ✅ AFFICHAGE DU COMPTEUR D'EMAILS ENVOYÉS */}
                    <div className="text-xs mt-1 text-gray-500">
                      ✉️ {emailsSent} email{emailsSent > 1 ? 's' : ''} envoyé{emailsSent > 1 ? 's' : ''}
                    </div>
                    
                    {/* ✅ AFFICHAGE DES NOTES */}
                    {c.notes && (
                      <div className="text-xs mt-2 p-2 bg-blue-50 rounded border border-blue-200 text-gray-700">
                        <span className="font-semibold">Notes :</span> {c.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <RelanceButton action={onGenerate.bind(null, c.id)} />
                    <DeleteButton
                      action={onDelete.bind(null, c.id)}
                      confirmText={`Voulez-vous vraiment supprimer le contact ${c.first_name ?? ''} ${c.last_name ?? ''} ?`}
                    />
                  </div>
                </div>

                {/* Dernier brouillon - Accordéon */}
                {lastDraft && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                      📄 Dernier brouillon IA — {new Date(lastDraft.created_at).toLocaleString()}
                    </summary>
                    <div className="mt-2 rounded border p-3 bg-gray-50">
                      <div className="font-semibold mb-2">Objet : {lastDraft.subject}</div>
                      <pre className="whitespace-pre-wrap text-sm mb-3">{lastDraft.body_text}</pre>
                      <div>
                        <SendButton action={() => onSend(lastDraft.id)} />
                      </div>
                    </div>
                  </details>
                )}

                {/* Historique complet des brouillons */}
                {draftsForContact.length > 1 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      Voir les {draftsForContact.length - 1} brouillons précédents
                    </summary>
                    <div className="mt-2 space-y-2">
                      {draftsForContact.slice(1).map((d) => (
                        <div key={d.id} className="border rounded p-2 bg-gray-50">
                          <div className="text-xs text-gray-500 mb-1">
                            {new Date(d.created_at).toLocaleString()}
                          </div>
                          <div className="font-semibold mb-1">Objet : {d.subject}</div>
                          <pre className="whitespace-pre-wrap text-xs">{d.body_text}</pre>
                          <div className="mt-1">
                            <SendButton action={() => onSend(d.id)} label="Envoyer ce brouillon" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>

        {!filtered.length && (
          <li className="text-gray-600 text-center py-10">Aucun contact trouvé 🕵️‍♂️</li>
        )}
      </ul>
    </>
  );
}