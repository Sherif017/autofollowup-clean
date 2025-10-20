'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImportContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setToast(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setContacts(results.data),
    });
  };

  const handleImport = async () => {
    if (!contacts.length) {
      setToast({ message: 'Aucun contact à importer.', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch('/api/import-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts }),
      });

      const data = await res.json();
      const success = res.ok;

      setToast({ message: data.message, type: success ? 'success' : 'error' });

      if (success) setContacts([]); // nettoyage
    } catch (error) {
      console.error(error);
      setToast({ message: "Erreur lors de l'import.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      {/* ✅ En-tête avec bouton d’export */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">📂 Importer des contacts</h1>

        <a
          href="/api/export-contacts"
          className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 shadow-sm transition"
        >
          ⬇️ Exporter mes contacts
        </a>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm"
        />

        {fileName && (
          <p className="text-sm text-gray-500">Fichier sélectionné : {fileName}</p>
        )}

        {contacts.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-700 mb-2">
              Aperçu des {Math.min(contacts.length, 5)} premiers contacts :
            </p>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Prénom</th>
                  <th className="p-2 border">Nom</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Statut</th>
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 5).map((c, i) => (
                  <tr key={i}>
                    <td className="border p-2">{c.first_name}</td>
                    <td className="border p-2">{c.last_name}</td>
                    <td className="border p-2">{c.email}</td>
                    <td className="border p-2">{c.status || 'lead'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || contacts.length === 0}
          className={`mt-4 px-4 py-2 rounded text-white font-medium ${
            loading || contacts.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
          }`}
        >
          {loading ? 'Import en cours...' : '📤 Importer les contacts'}
        </button>
      </div>

      {/* ✅ Toast visuel animé */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
