"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

const titles = {
  "/dashboard": "Overview",
  "/dashboard/invoices": "Invoices",
  "/dashboard/invoice-designer": "Invoice designer",
  "/dashboard/clients": "Clients",
  "/dashboard/employees": "Employees",
  "/dashboard/departments": "Departments",
  "/dashboard/payroll": "Payroll",
  "/dashboard/salary-slips": "Salary slips",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

function titleFor(pathname) {
  if (titles[pathname]) return titles[pathname];
  const base = "/" + pathname.split("/").slice(1, 3).join("/");
  return titles[base] || "Dashboard";
}

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSession)
      .catch(() => setSession(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <div>
        <h1 className="font-display text-lg font-semibold text-navy">{titleFor(pathname)}</h1>
        {session?.companyName && <p className="text-xs text-ink/50">{session.companyName}</p>}
      </div>

      <div className="flex items-center gap-3">
        {session?.isDemo && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Demo workspace — changes are sandboxed
          </span>
        )}
        <span className="hidden text-sm text-ink/60 sm:block">{session?.name}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
