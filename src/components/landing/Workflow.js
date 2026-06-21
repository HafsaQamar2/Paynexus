"use client";

import AnimatedParagraph from "./AnimatedParagraph";

const steps = [
  { n: "01", title: "Design once", desc: "Set your logo, colors and layout in the invoice designer. Every invoice afterward uses it automatically." },
  { n: "02", title: "Bill clients", desc: "Add line items, taxes and due dates, then send a shareable link — no client login required to view or pay." },
  { n: "03", title: "Run payroll", desc: "Add employees once, then process monthly payroll with allowances and deductions calculated for you." },
  { n: "04", title: "Review and report", desc: "Track outstanding payments and payroll expense together on a single financial dashboard." },
];

export default function Workflow() {
  return (
    <section id="workflow" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">How it works</span>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-navy md:text-4xl">
          From first invoice to first payslip in four steps.
        </h2>
        <AnimatedParagraph
          className="mt-4 max-w-2xl text-ink/70"
          text="The sequence below is the same order a finance team would naturally follow when setting up a new company on PayNexus."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <span className="font-display text-3xl font-semibold text-navy-100">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-[-16px] top-2 hidden h-px w-8 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
