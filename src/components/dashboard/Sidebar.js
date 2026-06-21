"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/invoices", label: "Invoices", icon: "🧾" },
  { href: "/dashboard/invoice-designer", label: "Invoice designer", icon: "🎨" },
  { href: "/dashboard/clients", label: "Clients", icon: "🤝" },
  { href: "/dashboard/employees", label: "Employees", icon: "👤" },
  { href: "/dashboard/departments", label: "Departments", icon: "🏷" },
  { href: "/dashboard/payroll", label: "Payroll", icon: "💳" },
  { href: "/dashboard/salary-slips", label: "Salary slips", icon: "📄" },
  { href: "/dashboard/reports", label: "Reports", icon: "📊" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-white md:flex md:flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link href="/dashboard">
          <Image src="/logo-full.svg" alt="PayNexus" width={140} height={34} />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`focus-ring flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-navy text-white" : "text-ink/70 hover:bg-surface hover:text-navy"
              }`}
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
