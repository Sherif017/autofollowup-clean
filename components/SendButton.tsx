'use client';
import { useState, useTransition, useEffect } from 'react';

type Props = {
  action: () => Promise<{ success?: boolean; error?: string }>;
  label?: string;
  variant?: 'primary' | 'secondary';
};

export default function SendButton({ 
  action, 
  label = "Envoyer l'email",
  variant = 'primary'
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-masquer le message après 4 secondes
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleClick = () => {
    setMessage(null); // Réinitialiser le message
    startTransition(async () => {
      try {
        const result = await action();
        if (result?.success) {
          setMessage({
            type: 'success',
            text: '✅ Email envoyé avec succès !',
          });
        } else if (result?.error) {
          setMessage({
            type: 'error',
            text: `❌ ${result.error}`,
          });
        } else {
          setMessage({
            type: 'error',
            text: '❌ Réponse inattendue du serveur.',
          });
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi :', error);
        setMessage({
          type: 'error',
          text: '❌ Erreur de communication avec le serveur.',
        });
      }
    });
  };

  const buttonClasses = variant === 'primary'
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={`text-sm rounded px-3 py-1.5 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${buttonClasses}`}
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Envoi…
          </span>
        ) : (
          label
        )}
      </button>

      {message && (
        <span
          className={`text-xs font-medium transition-opacity ${
            message.type === 'success'
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}