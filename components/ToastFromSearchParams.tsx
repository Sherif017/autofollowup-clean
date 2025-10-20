'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ToastFromSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const toastParam = searchParams.get('toast');
    if (toastParam) {
      // Décode et affiche le toast
      const decoded = decodeURIComponent(toastParam);
      setMessage(decoded);

      // Détecte type (simple heuristique)
      setType(
        decoded.toLowerCase().includes('échec') ||
        decoded.toLowerCase().includes('erreur')
          ? 'error'
          : 'success'
      );

      // Nettoie l'URL pour éviter le re-toast au refresh
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('toast');
      router.replace(`${window.location.pathname}?${newParams.toString()}`, { scroll: false });

      // Disparaît après 4s
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
