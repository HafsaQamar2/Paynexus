import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  const { companyName, name, email, password } = await req.json();

  if (!companyName || !name || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const company = await prisma.company.create({ data: { name: companyName } });

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      name,
      email,
      password: await hashPassword(password),
      role: "ADMIN",
    },
  });

  await prisma.invoiceTemplate.create({
    data: { companyId: company.id, name: "Classic Navy", isDefault: true },
  });

  const token = createSessionToken({ userId: user.id, companyId: company.id, role: user.role, name: user.name });
  setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
