'use client';

import { useState, useTransition } from 'react';

type Props = {
  action: (formData: FormData) => Promise<void>; // server action bindée
  label?: string;
};

export default function RelanceButton({ action, label = 'Relancer par IA' }: Props) {
  const [pending, start] = useTransition();
  const [clicked, setClicked] = useState(false);

  return (
    <form>
      <button
        type="submit"
        formAction={(fd) => {
          setClicked(true);
          start(async () => {
            await action(fd);
          });
        }}
        className="text-sm rounded bg-black text-white px-3 py-1 hover:bg-gray-900 disabled:opacity-60"
        disabled={pending}
      >
        {pending ? 'Génération…' : label}
      </button>
      {clicked && pending && (
        <span className="ml-2 text-xs text-gray-600">L’IA rédige le brouillon…</span>
      )}
    </form>
  );
}

