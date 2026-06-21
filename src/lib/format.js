// Shared display helpers so every page formats money and dates the same way.

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthLabel(month, year) {
  return `${MONTH_NAMES[(month || 1) - 1]} ${year}`;
}

// Recomputes invoice totals from a list of { quantity, rate } line items
// plus a tax percentage. Used identically on the new-invoice form, the
// edit form, and the public share page so totals can never drift.
export function calcInvoiceTotals(items, taxPercent = 0) {
  const subtotal = (items || []).reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.rate) || 0),
    0
  );
  const tax = subtotal * ((Number(taxPercent) || 0) / 100);
  return { subtotal, tax, total: subtotal + tax };
}
