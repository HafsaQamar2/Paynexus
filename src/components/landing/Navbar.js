import Link from "next/link";
import Image from "next/image";
import DemoButton from "./DemoButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo-full.svg" alt="PayNexus" width={160} height={40} priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
          <a href="#modules" className="hover:text-navy">Modules</a>
          <a href="#workflow" className="hover:text-navy">How it works</a>
          <a href="#designer" className="hover:text-navy">Invoice designer</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-ink/70 hover:text-navy sm:block">
            Log in
          </Link>
          <DemoButton size="sm" label="View live demo" />
        </div>
      </div>
    </header>
  );
}
