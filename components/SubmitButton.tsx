'use client';

import { useFormStatus } from 'react-dom';

type Props = { idleLabel: string; pendingLabel?: string; className?: string };

export default function SubmitButton({ idleLabel, pendingLabel = 'En cours…', className = '' }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded px-4 py-2 ${pending ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
