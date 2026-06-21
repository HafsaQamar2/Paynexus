"use client";

import AnimatedParagraph from "./AnimatedParagraph";

const modules = [
  {
    title: "Invoice management",
    desc: "Create invoices, manage clients, track status from draft to paid, and share invoices through a public link.",
  },
  {
    title: "Custom invoice designer",
    desc: "Build branded templates with your own logo, colors, fonts and layout, then preview and reuse them instantly.",
  },
  {
    title: "Employee management",
    desc: "Keep employee profiles, departments and salary structures organized in one searchable directory.",
  },
  {
    title: "Payroll management",
    desc: "Run monthly payroll with automatic salary, allowance and deduction calculations, and a full payroll history.",
  },
  {
    title: "Salary slip generation",
    desc: "Generate professional salary slips for every employee and download them as PDF in one click.",
  },
  {
    title: "Dashboard & reporting",
    desc: "See revenue, outstanding payments and payroll expense at a glance on one financial summary dashboard.",
  },
];

export default function ModulesShowcase() {
  return (
    <section id="modules" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">Everything in one place</span>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy md:text-4xl">
          Seven modules. One source of truth.
        </h2>
        <AnimatedParagraph
          className="mt-4 max-w-2xl text-ink/70"
          text="Every module reads from the same client, employee and financial records, so nothing has to be re-typed between invoicing and payroll."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.title} className="rounded-xl2 border border-border bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-navy">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
