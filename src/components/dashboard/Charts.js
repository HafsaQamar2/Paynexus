"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

export function RevenueVsPayrollChart({ data }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-navy">Revenue vs. payroll expense</h3>
      <p className="mt-1 text-xs text-ink/50">Last 6 months</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#1E293B" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#1E293B" }} axisLine={false} tickLine={false} width={48} />
            <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB", fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#0B1F4D" radius={[4, 4, 0, 0]} />
            <Bar dataKey="payroll" name="Payroll" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

const STATUS_COLORS = {
  DRAFT: "#94A3B8",
  SENT: "#3A4F85",
  PAID: "#10B981",
  OVERDUE: "#EF4444",
};

export function InvoiceStatusChart({ data }) {
  const hasData = data.some((d) => d.count > 0);
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-navy">Invoice status breakdown</h3>
      <p className="mt-1 text-xs text-ink/50">All invoices</p>
      <div className="mt-4 h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.map((d) => (
                  <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => v.toLowerCase()} />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E5E7EB", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/40">
            No invoices yet
          </div>
        )}
      </div>
    </Card>
  );
}
