import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const departments = await prisma.department.findMany({
    where: { companyId: session.companyId },
    include: { _count: { select: { employees: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(departments);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Department name is required." }, { status: 400 });

  const department = await prisma.department.create({
    data: { companyId: session.companyId, name: body.name },
  });
  return NextResponse.json(department, { status: 201 });
}
