"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function load() {
    fetch("/api/departments").then((r) => r.json()).then(setDepartments);
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setName("");
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this department? Employees in it will become unassigned.")) return;
    await fetch(`/api/departments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h2 className="font-display text-xl font-semibold text-navy">Departments</h2>

      <Card>
        <form onSubmit={add} className="flex gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engineering" />
          <Button type="submit">Add</Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>

      <Card padded={false}>
        {departments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-ink/50">No departments yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {departments.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-6 py-3.5 text-sm">
                <span className="font-medium text-ink">{d.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-ink/50">{d._count?.employees ?? 0} employees</span>
                  <Button variant="danger" size="sm" onClick={() => remove(d.id)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
