'use client';

type Props = {
  action: (formData: FormData) => void | Promise<void>; // Server Action bindée
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
            e.preventDefault();
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
