import { NextResponse } from "next/server";
import { createDemoWorkspace } from "@/lib/demoSeed";
import { setDemoCookie } from "@/lib/auth";

export async function POST() {
  try {
    const companyId = await createDemoWorkspace();
    setDemoCookie(companyId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to create demo workspace", err);
    return NextResponse.json({ error: "Could not start demo" }, { status: 500 });
  }
}
