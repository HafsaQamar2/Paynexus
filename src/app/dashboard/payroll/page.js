"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, StatusBadge } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Select } from "@/components/ui/Input";
import { formatCurrency, monthLabel, MONTH_NAMES } from "@/lib/format";

const now = new Date();

export default function PayrollPage() {
  const [runs, setRuns] = useState([]);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/payroll").then((r) => r.json()).then(setRuns);
  }
  useEffect(() => { load(); }, []);

  async function runPayroll(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/payroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error);
    setOpen(false);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">Payroll</h2>
        <Button onClick={() => setOpen(true)}>+ Run payroll</Button>
      </div>

      <Card padded={false}>
        {runs.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">
            No payroll has been run yet. Run your first payroll above.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Employees</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total net pay</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-6 py-3 font-medium text-ink">{monthLabel(r.month, r.year)}</td>
                  <td className="px-6 py-3 text-ink/70">{r.employeeCount}</td>
                  <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(r.totalNet)}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/dashboard/payroll/${r.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={open} title="Run payroll" onClose={() => setOpen(false)}>
        <form onSubmit={runPayroll} className="space-y-4">
          <p className="text-sm text-ink/60">
            This creates a payroll run for every active employee using their current base salary.
            You can adjust allowances and deductions per employee afterward.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Month">
              <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </Select>
            </Field>
            <Field label="Year">
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[year - 1, year, year + 1].map((y) => <option key={y} value={y}>{y}</option>)}
              </Select>
            </Field>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Running…" : "Run payroll"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
