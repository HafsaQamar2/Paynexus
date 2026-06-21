import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const templates = await prisma.invoiceTemplate.findMany({
    where: { companyId: session.companyId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(templates);
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Template name is required." }, { status: 400 });

  if (body.isDefault) {
    await prisma.invoiceTemplate.updateMany({
      where: { companyId: session.companyId },
      data: { isDefault: false },
    });
  }

  const template = await prisma.invoiceTemplate.create({
    data: {
      companyId: session.companyId,
      name: body.name,
      primaryColor: body.primaryColor || "#0B1F4D",
      accentColor: body.accentColor || "#F8FAFC",
      fontFamily: body.fontFamily || "Inter",
      layout: body.layout || "classic",
      showLogo: body.showLogo ?? true,
      footerNote: body.footerNote || "Thank you for your business.",
      isDefault: !!body.isDefault,
    },
  });
  return NextResponse.json(template, { status: 201 });
}
