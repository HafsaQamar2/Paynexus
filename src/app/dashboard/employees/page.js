"use client";

import { useEffect, useState } from "react";
import { Card, StatusBadge } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/format";

const BLANK = { name: "", email: "", phone: "", designation: "", departmentId: "", baseSalary: "", bankAccount: "", status: "active" };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/employees").then((r) => r.json()).then(setEmployees);
    fetch("/api/departments").then((r) => r.json()).then(setDepartments);
  }
  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null);
    setForm(BLANK);
    setError("");
    setOpen(true);
  }

  function openEdit(e) {
    setEditingId(e.id);
    setForm({
      name: e.name, email: e.email || "", phone: e.phone || "", designation: e.designation || "",
      departmentId: e.departmentId || "", baseSalary: e.baseSalary, bankAccount: e.bankAccount || "", status: e.status,
    });
    setError("");
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    if (!form.baseSalary || Number(form.baseSalary) <= 0) {
      return setError("Base salary must be greater than zero.");
    }
    setSaving(true);
    setError("");
    const url = editingId ? `/api/employees/${editingId}` : "/api/employees";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, departmentId: form.departmentId || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Something went wrong.");
    setOpen(false);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this employee? Their past payroll history will be kept.")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-navy">Employees</h2>
        <Button onClick={openCreate}>+ Add employee</Button>
      </div>

      <Card padded={false}>
        {employees.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No employees yet. Add your first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Base salary</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-6 py-3 font-medium text-ink">{e.name}</td>
                  <td className="px-6 py-3 text-ink/70">{e.department?.name || "—"}</td>
                  <td className="px-6 py-3 text-ink/70">{e.designation || "—"}</td>
                  <td className="px-6 py-3 text-ink/70">{formatCurrency(e.baseSalary)}</td>
                  <td className="px-6 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(e)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => remove(e.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={open} title={editingId ? "Edit employee" : "Add employee"} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Full name" required>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Designation">
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </Field>
            <Field label="Department">
              <Select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Unassigned</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Base salary (monthly)" required>
              <Input type="number" min="0" step="0.01" required value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
          </div>
          <Field label="Bank account" hint="Optional, for payroll reference">
            <Input value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
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
