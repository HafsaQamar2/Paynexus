"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, StatusBadge } from "@/components/ui/Card";
import StatCard from "@/components/dashboard/StatCard";
import { RevenueVsPayrollChart, InvoiceStatusChart } from "@/components/dashboard/Charts";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/stats").then((r) => r.json()).then(setStats);
    fetch("/api/invoices").then((r) => r.json()).then(setInvoices);
  }, []);

  if (!stats) return <p className="text-sm text-ink/50">Loading reports…</p>;

  const outstanding = invoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-navy">Reports</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total invoiced" value={formatCurrency(stats.revenue + stats.outstanding)} hint="Paid + outstanding" />
        <StatCard label="Collected" value={formatCurrency(stats.revenue)} hint="Paid invoices" />
        <StatCard label="Outstanding" value={formatCurrency(stats.outstanding)} hint={`${outstanding.length} unpaid invoices`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueVsPayrollChart data={stats.trend} />
        </div>
        <InvoiceStatusChart data={stats.statusCounts} />
      </div>

      <Card padded={false}>
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-semibold text-navy">Outstanding payments</h3>
        </div>
        {outstanding.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">Nothing outstanding — nice work.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Due date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {outstanding.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="font-medium text-navy hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-ink/70">{inv.client?.name}</td>
                  <td className="px-6 py-3 text-ink/70">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(inv.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
