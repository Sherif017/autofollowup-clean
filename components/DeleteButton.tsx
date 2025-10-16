'use client';

type Props = {
  // Une Server Action bindée (ex: deleteContact.bind(null, id))
  action: (formData: FormData) => void | Promise<void>;
  confirmText: string;
};

export default function DeleteButton({ action, confirmText }: Props) {
  return (
    <form>
      <button
        type="submit"
        formAction={action}
        onClick={(e) => {
          if (!confirm(confirmText)) {
            e.preventDefault(); // annule l'envoi si l'utilisateur refuse
          }
        }}
        className="text-sm rounded border px-3 py-1 hover:bg-gray-50 text-red-600"
        title="Supprimer"
      >
        Supprimer
      </button>
    </form>
  );
}
