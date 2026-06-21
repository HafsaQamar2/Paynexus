"use client";

import AnimatedParagraph from "./AnimatedParagraph";
import DemoButton from "./DemoButton";

export default function DesignerHighlight() {
  return (
    <section id="designer" className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <div className="rounded-xl2 border border-border bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="h-8 w-28 rounded bg-navy" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">Invoice #1004</span>
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/40">Billed to</p>
                <p className="mt-1 font-medium text-ink">Horizon Retail Co.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-ink/40">Due date</p>
                <p className="mt-1 font-medium text-ink">Jul 12, 2026</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {[
                ["Q3 marketing retainer", "$3,000.00"],
                ["Brand strategy consulting", "$1,500.00"],
              ].map(([label, amt]) => (
                <div key={label} className="flex justify-between rounded-lg bg-surface px-3 py-2.5 text-sm">
                  <span className="text-ink/70">{label}</span>
                  <span className="font-medium text-ink">{amt}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-border pt-4">
              <span className="font-display text-sm font-semibold text-navy">Total due</span>
              <span className="font-display text-lg font-semibold text-navy">$4,725.00</span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-600">Custom invoice designer</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Brand it once. Reuse it everywhere.
          </h2>
          <AnimatedParagraph
            className="mt-4 text-ink/70"
            text="Choose your logo placement, accent colors, fonts and section layout, preview the result against real invoice data, then save it as a template your whole team can reuse on every future bill."
          />
          <ul className="mt-6 space-y-3 text-sm text-ink/70">
            {[
              "Multiple saved themes per company",
              "Live preview before publishing",
              "PDF export that matches the on-screen design exactly",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-navy" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <DemoButton label="Try the designer in the demo" />
          </div>
        </div>
      </div>
    </section>
  );
}
