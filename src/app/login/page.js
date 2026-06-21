"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import DemoButton from "@/components/landing/DemoButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-xl2 border border-border bg-white p-8 shadow-panel">
        <Link href="/" className="mb-6 flex justify-center">
          <Image src="/logo-full.svg" alt="PayNexus" width={150} height={38} />
        </Link>
        <h1 className="text-center font-display text-xl font-semibold text-navy">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-ink/60">Log in to your company workspace.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Email">
            <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
          </Field>
          <Field label="Password">
            <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-ink/50">
          Seeded test login: admin@paynexus.app / admin123 (after running <code>npm run db:seed</code>)
        </p>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-ink/40">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <DemoButton className="w-full" label="Skip — view live demo" />
          <p className="text-sm text-ink/60">
            New here?{" "}
            <Link href="/signup" className="font-medium text-navy hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
