export function Card({ children, className = "", padded = true }) {
  return (
    <div className={`rounded-xl2 border border-border bg-white shadow-card ${padded ? "p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

const statusStyles = {
  DRAFT: "bg-slate-100 text-slate-600",
  SENT: "bg-blue-50 text-blue-600",
  PAID: "bg-emerald-50 text-emerald-600",
  OVERDUE: "bg-red-50 text-red-600",
  PROCESSED: "bg-emerald-50 text-emerald-600",
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status?.toLowerCase()}
    </span>
  );
}
