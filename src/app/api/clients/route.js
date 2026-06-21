import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { companyId: session.companyId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });
  return NextResponse.json(clients);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Client name is required." }, { status: 400 });

  const client = await prisma.client.create({
    data: {
      companyId: session.companyId,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
