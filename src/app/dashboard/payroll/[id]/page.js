"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, StatusBadge } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import SalarySlipPreview from "@/components/payroll/SalarySlipPreview";
import { formatCurrency, monthLabel } from "@/lib/format";

function SlipRow({ item, companyName, expanded, onToggle }) {
  const ref = useRef(null);
  return (
    <>
      <tr className="border-t border-border">
        <td className="px-6 py-3 font-medium text-ink">{item.employee?.name}</td>
        <td className="px-6 py-3 text-ink/70">{item.employee?.department?.name || "—"}</td>
        <td className="px-6 py-3 text-ink/70">{formatCurrency(item.basic)}</td>
        <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(item.netSalary)}</td>
        <td className="px-6 py-3 text-right">
          <Button variant="outline" size="sm" onClick={onToggle}>
            {expanded ? "Hide slip" : "View slip"}
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-surface">
          <td colSpan={5} className="px-6 py-6">
            <SalarySlipPreview ref={ref} item={item} companyName={companyName} />
            <div className="mt-4 flex justify-center">
              <DownloadPdfButton
                targetRef={ref}
                filename={`${item.employee?.name?.replace(/\s+/g, "-") || "slip"}-${item.payrollRun?.month || ""}-${item.payrollRun?.year || ""}.pdf`}
                size="sm"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function PayrollRunPage() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [edits, setEdits] = useState({});
  const [companyName, setCompanyName] = useState("Your company");
  const [expandedId, setExpandedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/payroll/${id}`).then((r) => r.json()).then((data) => {
      setRun(data);
      const e = {};
      data.items?.forEach((it) => { e[it.id] = { allowances: it.allowances, deductions: it.deductions }; });
      setEdits(e);
    });
  }, [id]);

  useEffect(() => {
    load();
    fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)).then((s) => s && setCompanyName(s.companyName));
  }, [load]);

  function updateEdit(itemId, key, value) {
    setEdits((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [key]: value } }));
  }

  async function saveEdits() {
    setSaving(true);
    const items = Object.entries(edits).map(([itemId, v]) => ({ id: itemId, ...v }));
    await fetch(`/api/payroll/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    await load();
    setSaving(false);
  }

  async function markProcessed() {
    await fetch(`/api/payroll/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PROCESSED" }),
    });
    load();
  }

  if (!run) return <p className="text-sm text-ink/50">Loading payroll run…</p>;

  const totalNet = run.items.reduce((s, it) => {
    const e = edits[it.id] || it;
    return s + it.basic + Number(e.allowances || 0) - Number(e.deductions || 0);
  }, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/payroll" className="text-sm text-ink/50 hover:text-navy">← All payroll runs</Link>
          <h2 className="mt-1 font-display text-xl font-semibold text-navy">{monthLabel(run.month, run.year)}</h2>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={run.status} />
          {run.status === "DRAFT" && (
            <Button onClick={markProcessed}>Mark as processed</Button>
          )}
        </div>
      </div>

      <Card padded={false}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-semibold text-navy">Allowances &amp; deductions</h3>
          {run.status === "DRAFT" && (
            <Button variant="outline" size="sm" onClick={saveEdits} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Basic</th>
              <th className="px-6 py-3">Allowances</th>
              <th className="px-6 py-3">Deductions</th>
              <th className="px-6 py-3 text-right">Net pay</th>
            </tr>
          </thead>
          <tbody>
            {run.items.map((it) => {
              const e = edits[it.id] || { allowances: it.allowances, deductions: it.deductions };
              const net = it.basic + Number(e.allowances || 0) - Number(e.deductions || 0);
              return (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-6 py-3 font-medium text-ink">{it.employee?.name}</td>
                  <td className="px-6 py-3 text-ink/70">{formatCurrency(it.basic)}</td>
                  <td className="px-6 py-3">
                    <input
                      type="number" min="0" step="0.01" disabled={run.status !== "DRAFT"}
                      value={e.allowances}
                      onChange={(ev) => updateEdit(it.id, "allowances", ev.target.value)}
                      className="focus-ring w-28 rounded-lg border border-border px-2.5 py-1.5 text-sm disabled:bg-surface"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number" min="0" step="0.01" disabled={run.status !== "DRAFT"}
                      value={e.deductions}
                      onChange={(ev) => updateEdit(it.id, "deductions", ev.target.value)}
                      className="focus-ring w-28 rounded-lg border border-border px-2.5 py-1.5 text-sm disabled:bg-surface"
                    />
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(net)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-surface">
              <td colSpan={4} className="px-6 py-3 text-right font-medium text-ink">Total net pay</td>
              <td className="px-6 py-3 text-right font-display font-semibold text-navy">{formatCurrency(totalNet)}</td>
            </tr>
          </tfoot>
        </table>
      </Card>

      <Card padded={false}>
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-display text-base font-semibold text-navy">Salary slips</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Basic</th>
              <th className="px-6 py-3 text-right">Net pay</th>
              <th className="px-6 py-3 text-right">Slip</th>
            </tr>
          </thead>
          <tbody>
            {run.items.map((it) => (
              <SlipRow
                key={it.id}
                item={{ ...it, payrollRun: run }}
                companyName={companyName}
                expanded={expandedId === it.id}
                onToggle={() => setExpandedId(expandedId === it.id ? null : it.id)}
              />
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
