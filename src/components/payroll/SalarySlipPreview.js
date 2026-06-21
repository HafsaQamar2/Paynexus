import { forwardRef } from "react";
import { formatCurrency, monthLabel } from "@/lib/format";

const SalarySlipPreview = forwardRef(function SalarySlipPreview(
  { item, companyName = "Your company" },
  ref
) {
  const employee = item?.employee || {};
  return (
    <div ref={ref} className="mx-auto w-full max-w-xl rounded-xl2 border border-border bg-white p-8">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="inline-flex h-10 items-center rounded-md bg-navy px-3 text-sm font-semibold text-white">
          {companyName}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink/40">Salary slip</p>
          <p className="font-medium text-ink">{monthLabel(item?.payrollRun?.month, item?.payrollRun?.year)}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/40">Employee</p>
          <p className="mt-1 font-medium text-ink">{employee.name}</p>
          <p className="text-ink/60">{employee.designation || "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink/40">Department</p>
          <p className="mt-1 font-medium text-ink">{employee.department?.name || "—"}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-sm">
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2.5 text-ink/60">Basic salary</td>
            <td className="py-2.5 text-right font-medium text-ink">{formatCurrency(item?.basic)}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-ink/60">Allowances</td>
            <td className="py-2.5 text-right font-medium text-emerald-600">
              + {formatCurrency(item?.allowances)}
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2.5 text-ink/60">Deductions</td>
            <td className="py-2.5 text-right font-medium text-red-600">
              − {formatCurrency(item?.deductions)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-5 flex justify-between border-t border-border pt-4">
        <span className="font-display text-base font-semibold text-navy">Net pay</span>
        <span className="font-display text-lg font-semibold text-navy">{formatCurrency(item?.netSalary)}</span>
      </div>

      <p className="mt-8 border-t border-border pt-4 text-xs text-ink/40">
        This is a system-generated salary slip and does not require a signature.
      </p>
    </div>
  );
});

export default SalarySlipPreview;
