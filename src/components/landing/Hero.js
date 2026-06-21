"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedParagraph from "./AnimatedParagraph";
import DemoButton from "./DemoButton";
import NexusGraphic from "./NexusGraphic";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-600"
          >
            Invoicing &amp; Payroll, Connected
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-tight text-navy md:text-5xl"
          >
            One platform for every invoice, every payslip, every client.
          </motion.h1>

          <AnimatedParagraph
            delay={0.5}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg"
            text="PayNexus brings invoice creation, custom branded templates, employee payroll, and salary slips into one dashboard — so finance teams stop juggling spreadsheets and start closing books faster."
          />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <DemoButton size="lg" label="View live demo — no signup" />
            <Link
              href="/signup"
              className="focus-ring text-sm font-semibold text-navy underline-offset-4 hover:underline"
            >
              Create your account →
            </Link>
          </div>

          <AnimatedParagraph
            delay={0.9}
            stagger={0.012}
            className="mt-6 text-sm text-ink/50"
            text="No credit card. No setup call. The live demo loads a complete sample workspace in seconds."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <NexusGraphic />
        </motion.div>
      </div>
    </section>
  );
}
