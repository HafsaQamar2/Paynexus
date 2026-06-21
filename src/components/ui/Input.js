export function Field({ label, children, hint, required }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function Input({ className = "", ...rest }) {
  return (
    <input
      className={`focus-ring w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 ${className}`}
      {...rest}
    />
  );
}

export function Textarea({ className = "", ...rest }) {
  return (
    <textarea
      className={`focus-ring w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 ${className}`}
      {...rest}
    />
  );
}

export function Select({ className = "", children, ...rest }) {
  return (
    <select
      className={`focus-ring w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
