import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { MONTH_NAMES } from "@/lib/format";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [invoices, payrollRuns, clientCount, employeeCount] = await Promise.all([
    prisma.invoice.findMany({
      where: { companyId: session.companyId },
      include: { items: true, client: true },
    }),
    prisma.payrollRun.findMany({
      where: { companyId: session.companyId },
      include: { items: true },
    }),
    prisma.client.count({ where: { companyId: session.companyId } }),
    prisma.employee.count({ where: { companyId: session.companyId } }),
  ]);

  const withTotal = invoices.map((inv) => ({
    ...inv,
    total: inv.items.reduce((s, it) => s + it.quantity * it.rate, 0) * (1 + inv.taxPercent / 100),
  }));

  const revenue = withTotal.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const outstanding = withTotal
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((s, i) => s + i.total, 0);

  const statusCounts = ["DRAFT", "SENT", "PAID", "OVERDUE"].map((status) => ({
    status,
    count: withTotal.filter((i) => i.status === status).length,
  }));

  // Last 6 months of revenue (paid invoices, by issue date) and payroll
  // expense (by run month/year), so they can sit on the same chart.
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { month: d.getMonth() + 1, year: d.getFullYear() };
  });

  const trend = months.map(({ month, year }) => {
    const monthRevenue = withTotal
      .filter((i) => {
        const d = new Date(i.issueDate);
        return i.status === "PAID" && d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .reduce((s, i) => s + i.total, 0);

    const run = payrollRuns.find((r) => r.month === month && r.year === year);
    const payrollExpense = run ? run.items.reduce((s, it) => s + it.netSalary, 0) : 0;

    return {
      label: `${MONTH_NAMES[month - 1].slice(0, 3)} '${String(year).slice(2)}`,
      revenue: Math.round(monthRevenue),
      payroll: Math.round(payrollExpense),
    };
  });

  const recentInvoices = [...withTotal]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      client: i.client?.name,
      status: i.status,
      total: i.total,
      dueDate: i.dueDate,
    }));

  return NextResponse.json({
    revenue,
    outstanding,
    invoiceCount: invoices.length,
    clientCount,
    employeeCount,
    statusCounts,
    trend,
    recentInvoices,
  });
}
