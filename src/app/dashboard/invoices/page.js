"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : "";
    fetch(`/api/invoices${qs}`)
      .then((r) => r.json())
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this invoice? This can't be undone.")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    load();
  }

  function copyLink(token, id) {
    const url = `${window.location.origin}/invoice/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-navy">Invoices</h2>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Link href="/dashboard/invoices/new">
            <Button>+ New invoice</Button>
          </Link>
        </div>
      </div>

      <Card padded={false}>
        {loading ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">Loading…</p>
        ) : invoices.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">
            No invoices match this filter yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Due date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="font-medium text-navy hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-ink/70">{inv.client?.name}</td>
                  <td className="px-6 py-3 text-ink/70">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-3">
                    <Select
                      value={inv.status}
                      onChange={(e) => setStatus(inv.id, e.target.value)}
                      className="w-32 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyLink(inv.shareToken, inv.id)}>
                        {copiedId === inv.id ? "Copied!" : "Copy link"}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => remove(inv.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
