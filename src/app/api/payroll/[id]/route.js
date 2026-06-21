import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function findOwned(id, companyId) {
  const run = await prisma.payrollRun.findUnique({
    where: { id },
    include: { items: { include: { employee: { include: { department: true } } } } },
  });
  if (!run || run.companyId !== companyId) return null;
  return run;
}

export async function GET(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const run = await findOwned(params.id, session.companyId);
  if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(run);
}

export async function PUT(req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  if (Array.isArray(body.items)) {
    await Promise.all(
      body.items.map((it) => {
        const allowances = Number(it.allowances) || 0;
        const deductions = Number(it.deductions) || 0;
        const item = existing.items.find((x) => x.id === it.id);
        if (!item) return Promise.resolve();
        return prisma.payrollItem.update({
          where: { id: it.id },
          data: {
            allowances,
            deductions,
            netSalary: item.basic + allowances - deductions,
          },
        });
      })
    );
  }

  const run = await prisma.payrollRun.update({
    where: { id: params.id },
    data: {
      status: body.status ?? existing.status,
      processedAt: body.status === "PROCESSED" ? new Date() : existing.processedAt,
    },
    include: { items: { include: { employee: { include: { department: true } } } } },
  });

  return NextResponse.json(run);
}
