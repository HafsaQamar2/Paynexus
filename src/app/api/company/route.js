import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const company = await prisma.company.update({
    where: { id: session.companyId },
    data: {
      name: body.name ?? undefined,
      primaryColor: body.primaryColor ?? undefined,
    },
  });
  return NextResponse.json(company);
}
