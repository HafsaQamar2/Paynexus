import Image from "next/image";
import Link from "next/link";
import DemoButton from "./DemoButton";

export default function Footer() {
  return (
    <>
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
            See your invoices and payroll on one screen, today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-100/90 text-white/70">
            Spin up a full sample workspace with clients, invoices and a processed payroll run already inside it.
          </p>
          <div className="mt-8 flex justify-center">
            <DemoButton size="lg" label="View live demo — no signup" />
          </div>
        </div>
      </section>

      <footer className="bg-navy-800 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <Image src="/logo-full-white.svg" alt="PayNexus" width={150} height={38} />
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/login" className="hover:text-white">Log in</Link>
            <Link href="/signup" className="hover:text-white">Create account</Link>
            <a href="#modules" className="hover:text-white">Modules</a>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} PayNexus. Built for the hackathon demo.</p>
        </div>
      </footer>
    </>
  );
}
