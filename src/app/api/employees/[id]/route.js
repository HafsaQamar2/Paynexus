import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function findOwned(id, companyId) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee || employee.companyId !== companyId) return null;
  return employee;
}

export async function GET(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { department: true },
  });
  if (!employee || employee.companyId !== session.companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PUT(req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.employee.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      designation: body.designation ?? existing.designation,
      departmentId: body.departmentId ?? existing.departmentId,
      baseSalary: body.baseSalary != null ? parseFloat(body.baseSalary) : existing.baseSalary,
      bankAccount: body.bankAccount ?? existing.bankAccount,
      status: body.status ?? existing.status,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.employee.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
