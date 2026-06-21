import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employees = await prisma.employee.findMany({
    where: { companyId: session.companyId },
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(employees);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.baseSalary) {
    return NextResponse.json({ error: "Name and base salary are required." }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: {
      companyId: session.companyId,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      designation: body.designation || null,
      departmentId: body.departmentId || null,
      baseSalary: parseFloat(body.baseSalary),
      bankAccount: body.bankAccount || null,
      status: body.status || "active",
    },
  });
  return NextResponse.json(employee, { status: 201 });
}
