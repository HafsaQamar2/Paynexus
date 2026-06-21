"use client";

import { useEffect } from "react";

// A small, dependency-free modal. Pressing Escape or clicking the backdrop
// closes it. Used for every "create/edit X" form in the dashboard so we
// don't need a separate page per record.
export default function Modal({ open, title, onClose, children, width = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${width} rounded-xl2 border border-border bg-white p-6 shadow-panel`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring rounded-md p-1 text-ink/40 hover:bg-surface hover:text-ink"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
