"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import InvoiceItemsEditor from "@/components/invoice/InvoiceItemsEditor";
import { formatCurrency, calcInvoiceTotals } from "@/lib/format";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientId: "",
    templateId: "",
    dueDate: "",
    taxPercent: 0,
    notes: "",
  });
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
    fetch("/api/templates").then((r) => r.json()).then((t) => {
      setTemplates(t);
      const def = t.find((x) => x.isDefault) || t[0];
      if (def) setForm((f) => ({ ...f, templateId: def.id }));
    });
  }, []);

  const totals = calcInvoiceTotals(items, form.taxPercent);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.clientId) return setError("Please choose a client.");
    if (!form.dueDate) return setError("Please choose a due date.");

    setSaving(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create invoice.");
      router.push(`/dashboard/invoices/${data.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">New invoice</h2>
        <Link href="/dashboard/invoices" className="text-sm text-ink/60 hover:text-navy">
          Cancel
        </Link>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client" required>
              <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Template">
              <Select value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })}>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Due date" required>
              <Input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
            <Field label="Tax (%)">
              <Input type="number" min="0" step="0.5" value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} />
            </Field>
          </div>

          {clients.length === 0 && (
            <p className="rounded-lg bg-surface px-4 py-3 text-sm text-ink/60">
              You don&apos;t have any clients yet.{" "}
              <Link href="/dashboard/clients" className="font-medium text-navy hover:underline">
                Add one first →
              </Link>
            </p>
          )}

          <div>
            <p className="mb-3 text-sm font-medium text-ink">Line items</p>
            <InvoiceItemsEditor items={items} onChange={setItems} />
          </div>

          <Field label="Notes (optional)">
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Payment terms, thank-you note, etc." />
          </Field>

          <div className="flex justify-end border-t border-border pt-5">
            <div className="w-56 space-y-1.5 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Tax</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-navy">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link href="/dashboard/invoices">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create invoice"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
