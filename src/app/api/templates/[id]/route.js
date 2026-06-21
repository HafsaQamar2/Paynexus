import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function findOwned(id, companyId) {
  const template = await prisma.invoiceTemplate.findUnique({ where: { id } });
  if (!template || template.companyId !== companyId) return null;
  return template;
}

export async function PUT(req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  if (body.isDefault) {
    await prisma.invoiceTemplate.updateMany({
      where: { companyId: session.companyId },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.invoiceTemplate.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      primaryColor: body.primaryColor ?? existing.primaryColor,
      accentColor: body.accentColor ?? existing.accentColor,
      fontFamily: body.fontFamily ?? existing.fontFamily,
      layout: body.layout ?? existing.layout,
      showLogo: body.showLogo ?? existing.showLogo,
      footerNote: body.footerNote ?? existing.footerNote,
      isDefault: body.isDefault ?? existing.isDefault,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const inUse = await prisma.invoice.count({ where: { templateId: params.id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "This template is used by existing invoices and can't be deleted." },
      { status: 409 }
    );
  }

  await prisma.invoiceTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
