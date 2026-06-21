"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, StatusBadge } from "@/components/ui/Card";
import StatCard from "@/components/dashboard/StatCard";
import { RevenueVsPayrollChart, InvoiceStatusChart } from "@/components/dashboard/Charts";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sm text-ink/50">Loading overview…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue collected" value={formatCurrency(stats.revenue)} hint="From paid invoices" />
        <StatCard label="Outstanding" value={formatCurrency(stats.outstanding)} hint="Sent + overdue" />
        <StatCard label="Clients" value={stats.clientCount} hint="Active client records" />
        <StatCard label="Employees" value={stats.employeeCount} hint="On payroll" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueVsPayrollChart data={stats.trend} />
        </div>
        <InvoiceStatusChart data={stats.statusCounts} />
      </div>

      <Card padded={false}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-semibold text-navy">Recent invoices</h3>
          <Link href="/dashboard/invoices" className="text-sm font-medium text-navy hover:underline">
            View all
          </Link>
        </div>
        {stats.recentInvoices.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">
            No invoices yet. Create your first one from the Invoices page.
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
              </tr>
            </thead>
            <tbody>
              {stats.recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-t border-border">
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/invoices/${inv.id}`} className="font-medium text-navy hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-ink/70">{inv.client}</td>
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
