"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [session, setSession] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)).then((s) => {
      setSession(s);
      setCompanyName(s?.companyName || "");
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: companyName }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  if (!session) return <p className="text-sm text-ink/50">Loading settings…</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h2 className="font-display text-xl font-semibold text-navy">Settings</h2>

      {session.isDemo && (
        <div className="rounded-xl2 border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            You&apos;re in a demo sandbox. Changes here only affect this temporary workspace.
          </p>
        </div>
      )}

      <Card>
        <h3 className="font-display text-base font-semibold text-navy">Company profile</h3>
        <form onSubmit={save} className="mt-4 space-y-4">
          <Field label="Company name">
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            {saved && <span className="text-sm text-emerald-600">Saved</span>}
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-navy">Your account</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink/50">Name</dt>
            <dd className="font-medium text-ink">{session.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/50">Role</dt>
            <dd className="font-medium capitalize text-ink">{session.role?.toLowerCase()}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
