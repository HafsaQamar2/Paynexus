import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const company = await prisma.company.findUnique({ where: { id: session.companyId } });

  return NextResponse.json({
    name: session.name,
    role: session.role,
    isDemo: session.isDemo,
    companyName: company?.name || "Workspace",
  });
}
