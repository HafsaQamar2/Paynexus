import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");

  const invoices = await prisma.invoice.findMany({
    where: {
      companyId: session.companyId,
      ...(status ? { status } : {}),
    },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  // Totals aren't stored — they're derived from items, so they can never
  // go out of sync with the line items a user is editing.
  const withTotals = invoices.map((inv) => {
    const subtotal = inv.items.reduce((s, it) => s + it.quantity * it.rate, 0);
    const tax = subtotal * (inv.taxPercent / 100);
    return { ...inv, subtotal, tax, total: subtotal + tax };
  });

  return NextResponse.json(withTotals);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.clientId || !body.dueDate || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "A client, due date and at least one line item are required." },
      { status: 400 }
    );
  }

  let templateId = body.templateId || null;
  if (!templateId) {
    const def = await prisma.invoiceTemplate.findFirst({
      where: { companyId: session.companyId, isDefault: true },
    });
    templateId = def?.id || null;
  }

  const count = await prisma.invoice.count({ where: { companyId: session.companyId } });
  const invoiceNumber = body.invoiceNumber || `INV-${1000 + count + 1}`;

  const invoice = await prisma.invoice.create({
    data: {
      companyId: session.companyId,
      clientId: body.clientId,
      templateId,
      invoiceNumber,
      issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
      dueDate: new Date(body.dueDate),
      status: body.status || "DRAFT",
      taxPercent: Number(body.taxPercent) || 0,
      notes: body.notes || null,
      items: {
        create: body.items.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity) || 1,
          rate: Number(it.rate) || 0,
        })),
      },
    },
    include: { client: true, items: true, template: true },
  });

  return NextResponse.json(invoice, { status: 201 });
}
