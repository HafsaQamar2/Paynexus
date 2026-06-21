"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import SalarySlipPreview from "@/components/payroll/SalarySlipPreview";
import { formatCurrency, monthLabel } from "@/lib/format";

function Row({ item, companyName, expanded, onToggle }) {
  const ref = useRef(null);
  return (
    <>
      <tr className="border-t border-border">
        <td className="px-6 py-3 font-medium text-ink">{item.employee?.name}</td>
        <td className="px-6 py-3 text-ink/70">{monthLabel(item.payrollRun?.month, item.payrollRun?.year)}</td>
        <td className="px-6 py-3 text-ink/70">{item.employee?.department?.name || "—"}</td>
        <td className="px-6 py-3 text-right font-medium text-ink">{formatCurrency(item.netSalary)}</td>
        <td className="px-6 py-3 text-right">
          <Button variant="outline" size="sm" onClick={onToggle}>{expanded ? "Hide" : "View"}</Button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-surface">
          <td colSpan={5} className="px-6 py-6">
            <SalarySlipPreview ref={ref} item={item} companyName={companyName} />
            <div className="mt-4 flex justify-center">
              <DownloadPdfButton
                targetRef={ref}
                filename={`${item.employee?.name?.replace(/\s+/g, "-") || "slip"}-${item.payrollRun?.month}-${item.payrollRun?.year}.pdf`}
                size="sm"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function SalarySlipsPage() {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [companyName, setCompanyName] = useState("Your company");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch("/api/employees").then((r) => r.json()).then(setEmployees);
    fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)).then((s) => s && setCompanyName(s.companyName));
  }, []);

  useEffect(() => {
    const qs = employeeId ? `?employeeId=${employeeId}` : "";
    fetch(`/api/salary-slips${qs}`).then((r) => r.json()).then(setItems);
  }, [employeeId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">Salary slip history</h2>
        <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="w-56">
          <option value="">All employees</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </Select>
      </div>

      <Card padded={false}>
        {items.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">
            No salary slips yet. Run payroll from the Payroll page first.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-right">Net pay</th>
                <th className="px-6 py-3 text-right">Slip</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <Row
                  key={it.id}
                  item={it}
                  companyName={companyName}
                  expanded={expandedId === it.id}
                  onToggle={() => setExpandedId(expandedId === it.id ? null : it.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
