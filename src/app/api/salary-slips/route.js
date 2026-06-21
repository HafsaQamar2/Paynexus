import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const employeeId = req.nextUrl.searchParams.get("employeeId");

  const items = await prisma.payrollItem.findMany({
    where: {
      payrollRun: { companyId: session.companyId },
      ...(employeeId ? { employeeId } : {}),
    },
    include: {
      employee: { include: { department: true } },
      payrollRun: true,
    },
    orderBy: [{ payrollRun: { year: "desc" } }, { payrollRun: { month: "desc" } }],
  });

  return NextResponse.json(items);
}
