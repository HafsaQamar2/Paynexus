import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const runs = await prisma.payrollRun.findMany({
    where: { companyId: session.companyId },
    include: { items: true },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  const withTotals = runs.map((r) => ({
    ...r,
    employeeCount: r.items.length,
    totalNet: r.items.reduce((s, it) => s + it.netSalary, 0),
  }));

  return NextResponse.json(withTotals);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const month = Number(body.month);
  const year = Number(body.year);
  if (!month || !year) {
    return NextResponse.json({ error: "Month and year are required." }, { status: 400 });
  }

  const existing = await prisma.payrollRun.findUnique({
    where: { companyId_month_year: { companyId: session.companyId, month, year } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Payroll for this month has already been run." },
      { status: 409 }
    );
  }

  const employees = await prisma.employee.findMany({
    where: { companyId: session.companyId, status: "active" },
  });
  if (employees.length === 0) {
    return NextResponse.json(
      { error: "Add at least one active employee before running payroll." },
      { status: 400 }
    );
  }

  const run = await prisma.payrollRun.create({
    data: {
      companyId: session.companyId,
      month,
      year,
      status: "DRAFT",
      items: {
        create: employees.map((e) => ({
          employeeId: e.id,
          basic: e.baseSalary,
          allowances: 0,
          deductions: 0,
          netSalary: e.baseSalary,
        })),
      },
    },
    include: { items: { include: { employee: true } } },
  });

  return NextResponse.json(run, { status: 201 });
}
