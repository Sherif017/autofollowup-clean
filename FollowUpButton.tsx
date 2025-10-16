'use client';

import { useState, useTransition } from 'react';

export default function FollowUpButton({ action }: { action: () => Promise<string> }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    startTransition(async () => {
      const result = await action(); // Appelle la Server Action
      setMessage(result);
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-sm rounded border px-3 py-1 hover:bg-gray-50 text-blue-600"
      >
        {isPending ? 'Génération...' : 'Relancer par IA'}
      </button>

      {message && (
        <div className="mt-2 p-2 border rounded bg-gray-50 text-sm whitespace-pre-wrap">
          {message}
        </div>
      )}
    </div>
  );
}
