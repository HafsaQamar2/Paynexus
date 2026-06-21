import { forwardRef } from "react";
import { formatCurrency, formatDate, calcInvoiceTotals } from "@/lib/format";

// forwardRef so the same component can be screenshotted by
// DownloadPdfButton in three different places without duplicating markup.
const InvoicePreview = forwardRef(function InvoicePreview(
  { invoice, items, client, template, companyName = "Your company" },
  ref
) {
  const t = template || {};
  const primary = t.primaryColor || "#0B1F4D";
  const accent = t.accentColor || "#F8FAFC";
  const { subtotal, tax, total } = calcInvoiceTotals(items, invoice?.taxPercent);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-2xl rounded-xl2 border border-border bg-white p-8"
      style={{ fontFamily: t.fontFamily || "Inter, sans-serif" }}
    >
      <div className="flex items-start justify-between border-b pb-6" style={{ borderColor: accent }}>
        <div>
          {t.showLogo !== false && (
            <div
              className="mb-3 inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-white"
              style={{ backgroundColor: primary }}
            >
              {companyName}
            </div>
          )}
          <p className="text-xs uppercase tracking-wide text-ink/40">Invoice</p>
          <p className="text-xl font-semibold" style={{ color: primary }}>
            {invoice?.invoiceNumber}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-ink/50">Issue date</p>
          <p className="font-medium text-ink">{formatDate(invoice?.issueDate)}</p>
          <p className="mt-2 text-ink/50">Due date</p>
          <p className="font-medium text-ink">{formatDate(invoice?.dueDate)}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-between text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/40">Billed to</p>
          <p className="mt-1 font-medium text-ink">{client?.name || "—"}</p>
          {client?.email && <p className="text-ink/60">{client.email}</p>}
          {client?.address && <p className="text-ink/60">{client.address}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink/40">Status</p>
          <p className="mt-1 font-medium capitalize text-ink">{invoice?.status?.toLowerCase()}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-ink/40" style={{ borderColor: accent }}>
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Rate</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(items || []).map((it, i) => (
            <tr key={it.id || i} className="border-b" style={{ borderColor: accent }}>
              <td className="py-2.5 text-ink">{it.description}</td>
              <td className="py-2.5 text-right text-ink/70">{it.quantity}</td>
              <td className="py-2.5 text-right text-ink/70">{formatCurrency(it.rate)}</td>
              <td className="py-2.5 text-right font-medium text-ink">
                {formatCurrency(it.quantity * it.rate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-56 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink/60">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/60">
            <span>Tax ({invoice?.taxPercent || 0}%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold" style={{ borderColor: accent, color: primary }}>
            <span>Total due</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {(invoice?.notes || t.footerNote) && (
        <p className="mt-8 border-t pt-4 text-xs text-ink/50" style={{ borderColor: accent }}>
          {invoice?.notes || t.footerNote}
        </p>
      )}
    </div>
  );
});

export default InvoicePreview;
