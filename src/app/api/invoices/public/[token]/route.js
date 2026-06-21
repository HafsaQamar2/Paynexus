import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// No getSession() call here on purpose — this is the one endpoint a
// client should be able to open from an emailed link with no account
// at all. It only ever looks up by the random shareToken, never by id,
// so an invoice can't be enumerated.
export async function GET(_req, { params }) {
  const invoice = await prisma.invoice.findUnique({
    where: { shareToken: params.token },
    include: {
      client: true,
      items: true,
      template: true,
      company: { select: { name: true, logoUrl: true, primaryColor: true } },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  return NextResponse.json(invoice);
}
