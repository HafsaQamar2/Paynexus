import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(_req, { params }) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const department = await prisma.department.findUnique({ where: { id: params.id } });
  if (!department || department.companyId !== session.companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.department.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
