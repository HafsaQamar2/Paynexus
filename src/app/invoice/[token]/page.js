"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Card";
import DownloadPdfButton from "@/components/ui/DownloadPdfButton";
import InvoicePreview from "@/components/invoice/InvoicePreview";

export default function PublicInvoicePage() {
  const { token } = useParams();
  const previewRef = useRef(null);
  const [invoice, setInvoice] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/public/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setInvoice)
      .catch(() => setNotFound(true));
  }, [token]);

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
        <p className="font-display text-xl font-semibold text-navy">Invoice not found</p>
        <p className="text-sm text-ink/60">This link may have expired or the invoice was removed.</p>
        <Link href="/" className="text-sm font-medium text-navy hover:underline">← Back to PayNexus</Link>
      </main>
    );
  }

  if (!invoice) {
    return <main className="flex min-h-screen items-center justify-center bg-surface text-sm text-ink/50">Loading invoice…</main>;
  }

  return (
    <main className="min-h-screen bg-surface pb-16">
      <header className="border-b border-border bg-white py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6">
          <Link href="/"><Image src="/logo-full.svg" alt="PayNexus" width={140} height={34} /></Link>
          <StatusBadge status={invoice.status} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pt-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-ink/60">Invoice from {invoice.company?.name}</p>
          <DownloadPdfButton targetRef={previewRef} filename={`${invoice.invoiceNumber}.pdf`} />
        </div>
        <InvoicePreview
          ref={previewRef}
          invoice={invoice}
          items={invoice.items}
          client={invoice.client}
          template={invoice.template}
          companyName={invoice.company?.name}
        />
        <p className="mt-6 text-center text-xs text-ink/40">
          Powered by <Link href="/" className="font-medium text-navy hover:underline">PayNexus</Link>
        </p>
      </div>
    </main>
  );
}
