"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import InvoiceItemsEditor from "@/components/invoice/InvoiceItemsEditor";
import InvoicePreview from "@/components/invoice/InvoicePreview";

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"];

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const previewRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInvoice(data);
        setItems(data.items);
        setTaxPercent(data.taxPercent);
      });
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, taxPercent }),
    });
    await load();
    setSaving(false);
  }

  async function setStatus(status) {
    await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove() {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    router.push("/dashboard/invoices");
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/invoice/${invoice.shareToken}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!invoice) return <p className="text-sm text-ink/50">Loading invoice…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/invoices" className="text-sm text-ink/50 hover:text-navy">
            ← All invoices
          </Link>
          <h2 className="mt-1 font-display text-xl font-semibold text-navy">{invoice.invoiceNumber}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={invoice.status} onChange={(e) => setStatus(e.target.value)} className="w-36">
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Button variant="outline" onClick={copyLink}>{copied ? "Link copied!" : "Copy share link"}</Button>
          <DownloadPdfButton targetRef={previewRef} filename={`${invoice.invoiceNumber}.pdf`} variant="outline" />
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <h3 className="mb-4 font-display text-base font-semibold text-navy">Edit line items</h3>
          <InvoiceItemsEditor items={items} onChange={setItems} />

          <div className="mt-5 flex items-end gap-4 border-t border-border pt-5">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Tax (%)</span>
              <input
                type="number"
                min="0"
                step="0.5"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="focus-ring w-24 rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </div>
        </Card>

        <div>
          <p className="mb-3 text-sm font-medium text-ink/60">Live preview — this is what the client sees</p>
          <InvoicePreview
            ref={previewRef}
            invoice={{ ...invoice, taxPercent }}
            items={items}
            client={invoice.client}
            template={invoice.template}
            companyName={invoice.company?.name}
          />
        </div>
      </div>
    </div>
  );
}
