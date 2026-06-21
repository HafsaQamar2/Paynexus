"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/format";

export default function InvoiceItemsEditor({ items, onChange }) {
  function update(i, key, value) {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
    onChange(next);
  }

  function addRow() {
    onChange([...items, { description: "", quantity: 1, rate: 0 }]);
  }

  function removeRow(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-[1fr_90px_120px_120px_36px] gap-3 px-1 text-xs font-medium uppercase tracking-wide text-ink/40 sm:grid">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      {items.map((it, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_90px_120px_120px_36px]">
          <Input
            placeholder="Service or product"
            value={it.description}
            onChange={(e) => update(i, "description", e.target.value)}
          />
          <Input
            type="number"
            min="0"
            step="1"
            value={it.quantity}
            onChange={(e) => update(i, "quantity", e.target.value)}
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            value={it.rate}
            onChange={(e) => update(i, "rate", e.target.value)}
          />
          <div className="flex items-center justify-end text-sm font-medium text-ink sm:px-2">
            {formatCurrency((Number(it.quantity) || 0) * (Number(it.rate) || 0))}
          </div>
          <button
            type="button"
            onClick={() => removeRow(i)}
            disabled={items.length === 1}
            aria-label="Remove line item"
            className="focus-ring justify-self-end rounded-md p-2 text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
          >
            ✕
          </button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        + Add line item
      </Button>
    </div>
  );
}
