"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import InvoicePreview from "@/components/invoice/InvoicePreview";

const FONTS = ["Inter", "Space Grotesk", "Georgia", "Arial"];
const LAYOUTS = [
  { value: "classic", label: "Classic" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
];

const SAMPLE_ITEMS = [
  { description: "Brand strategy consulting", quantity: 1, rate: 1500 },
  { description: "Logo design package", quantity: 1, rate: 600 },
];
const SAMPLE_INVOICE = {
  invoiceNumber: "INV-1004",
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 14 * 86400000),
  status: "SENT",
  taxPercent: 5,
};
const SAMPLE_CLIENT = { name: "Horizon Retail Co.", email: "billing@horizonretail.com" };

const BLANK = {
  name: "",
  primaryColor: "#0B1F4D",
  accentColor: "#F8FAFC",
  fontFamily: "Inter",
  layout: "classic",
  showLogo: true,
  footerNote: "Thank you for your business.",
  isDefault: false,
};

export default function InvoiceDesignerPage() {
  const [templates, setTemplates] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/templates").then((r) => r.json()).then((t) => {
      setTemplates(t);
      if (!activeId && t[0]) selectTemplate(t[0]);
    });
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function selectTemplate(t) {
    setActiveId(t.id);
    setForm({
      name: t.name, primaryColor: t.primaryColor, accentColor: t.accentColor,
      fontFamily: t.fontFamily, layout: t.layout, showLogo: t.showLogo,
      footerNote: t.footerNote || "", isDefault: t.isDefault,
    });
  }

  function newTemplate() {
    setActiveId(null);
    setForm(BLANK);
  }

  async function save() {
    if (!form.name) return alert("Give this template a name first.");
    setSaving(true);
    const url = activeId ? `/api/templates/${activeId}` : "/api/templates";
    const method = activeId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return alert(data.error || "Could not save template.");
    setActiveId(data.id);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this template?")) return;
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    if (id === activeId) newTemplate();
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">Invoice designer</h2>
        <Button variant="outline" onClick={newTemplate}>+ New template</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr_1fr]">
        <Card padded={false}>
          <div className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
            Saved templates
          </div>
          <div className="space-y-1 p-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`focus-ring flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                  t.id === activeId ? "bg-navy text-white" : "text-ink/70 hover:bg-surface"
                }`}
              >
                <span>{t.name}</span>
                {t.isDefault && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${t.id === activeId ? "bg-white/20" : "bg-navy-50 text-navy-600"}`}>
                    default
                  </span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <Field label="Template name" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Navy" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary color">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-10 w-12 cursor-pointer rounded border border-border" />
                  <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Accent color">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="h-10 w-12 cursor-pointer rounded border border-border" />
                  <Input value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Font">
                <Select value={form.fontFamily} onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Layout">
                <Select value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })}>
                  {LAYOUTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Footer note">
              <Input value={form.footerNote} onChange={(e) => setForm({ ...form, footerNote: e.target.value })} />
            </Field>

            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={form.showLogo} onChange={(e) => setForm({ ...form, showLogo: e.target.checked })} />
              Show company logo badge
            </label>
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              Use as default for new invoices
            </label>

            <div className="flex justify-between border-t border-border pt-4">
              {activeId && (
                <Button variant="danger" onClick={() => remove(activeId)}>Delete</Button>
              )}
              <Button onClick={save} disabled={saving} className="ml-auto">
                {saving ? "Saving…" : activeId ? "Save changes" : "Create template"}
              </Button>
            </div>
          </div>
        </Card>

        <div>
          <p className="mb-3 text-sm font-medium text-ink/60">Live preview</p>
          <InvoicePreview
            invoice={SAMPLE_INVOICE}
            items={SAMPLE_ITEMS}
            client={SAMPLE_CLIENT}
            template={form}
            companyName="Your company"
          />
        </div>
      </div>
    </div>
  );
}
