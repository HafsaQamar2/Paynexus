"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";

const BLANK = { name: "", email: "", phone: "", address: "" };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }
  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(BLANK);
    setError("");
    setOpen(true);
  }

  function openEdit(c) {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email || "", phone: c.phone || "", address: c.address || "" });
    setError("");
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = editingId ? `/api/clients/${editingId}` : "/api/clients";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Something went wrong.");
    setOpen(false);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this client? Invoices linked to them will remain but lose the client reference.")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">Clients</h2>
        <Button onClick={openCreate}>+ Add client</Button>
      </div>

      <Card padded={false}>
        {clients.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No clients yet. Add your first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Invoices</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-6 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-6 py-3 text-ink/70">{c.email || "—"}</td>
                  <td className="px-6 py-3 text-ink/70">{c.phone || "—"}</td>
                  <td className="px-6 py-3 text-ink/70">{c._count?.invoices ?? 0}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(c)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => remove(c.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={open} title={editingId ? "Edit client" : "Add client"} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Name" required>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Address">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
