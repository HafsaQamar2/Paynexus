import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function findOwned(id, companyId) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, items: true, template: true, company: { select: { name: true } } },
  });
  if (!invoice || invoice.companyId !== companyId) return null;
  return invoice;
}

export async function GET(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await findOwned(params.id, session.companyId);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Items are replaced wholesale on every save — simpler and safer than
  // diffing add/remove/edit on a small per-invoice line item list.
  if (Array.isArray(body.items)) {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: params.id } });
  }

  const updated = await prisma.invoice.update({
    where: { id: params.id },
    data: {
      clientId: body.clientId ?? existing.clientId,
      templateId: body.templateId ?? existing.templateId,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
      status: body.status ?? existing.status,
      taxPercent: body.taxPercent != null ? Number(body.taxPercent) : existing.taxPercent,
      notes: body.notes ?? existing.notes,
      ...(Array.isArray(body.items)
        ? {
            items: {
              create: body.items.map((it) => ({
                description: it.description,
                quantity: Number(it.quantity) || 1,
                rate: Number(it.rate) || 0,
              })),
            },
          }
        : {}),
    },
    include: { client: true, items: true, template: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.invoice.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
