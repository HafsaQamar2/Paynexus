import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function findOwned(id, companyId) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client || client.companyId !== companyId) return null;
  return client;
}

export async function GET(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await findOwned(params.id, session.companyId);
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function PUT(req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.client.update({
    where: { id: params.id },
    data: {
      name: body.name ?? existing.name,
      email: body.email ?? existing.email,
      phone: body.phone ?? existing.phone,
      address: body.address ?? existing.address,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await findOwned(params.id, session.companyId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.client.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
