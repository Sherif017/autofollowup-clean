'use client';
import { useState, useEffect } from 'react';

type Props = {
  onFilter: (q: string, status: string) => void;
};

export default function FilterBar({ onFilter }: Props) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  // ✅ Utiliser useEffect pour appeler onFilter APRÈS que les states soient mis à jour
  useEffect(() => {
    onFilter(q, status);
  }, [q, status, onFilter]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Rechercher un contact..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded p-2 w-full md:w-1/2"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded p-2 w-full md:w-1/3"
      >
        <option value="">Tous les statuts</option>
        <option value="lead">lead</option>
        <option value="prospect">prospect</option>
        <option value="client">client</option>
        <option value="perdu">perdu</option>
      </select>
    </div>
  );
}