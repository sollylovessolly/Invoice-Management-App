import { useEffect, useRef } from "react";

export default function DeleteModal({ onConfirm, onCancel, invoiceId }) {
  const cancelRef = useRef(null);
  const deleteRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();

    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();

      if (e.key === "Tab") {
        const focusable = [cancelRef.current, deleteRef.current].filter(Boolean);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!focusable.length) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="rounded-lg p-8 max-w-md w-full shadow-xl"
        style={{ background: "var(--card)", color: "var(--text)" }}
      >
        <h2 id="delete-modal-title" className="text-2xl font-bold mb-4">
          Confirm Deletion
        </h2>

        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--subtext)" }}>
          Are you sure you want to delete invoice{" "}
          <span className="font-bold" style={{ color: "var(--text)" }}>
            #{invoiceId}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-6 py-4 rounded-full text-sm font-bold transition hover:opacity-90"
            style={{
              background: "var(--input)",
              color: "#7E88C3",
            }}
          >
            Cancel
          </button>

          <button
            ref={deleteRef}
            onClick={onConfirm}
            className="bg-[#EC5757] text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-[#FF9797] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}









