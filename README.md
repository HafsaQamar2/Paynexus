# PayNexus

**Invoicing & payroll, connected.** A full-stack SaaS platform for small and
medium businesses to design branded invoices, manage clients and employees,
run payroll, and generate salary slips — all from one dashboard.

Built for the **Smart Invoice & Payroll Management Platform** hackathon brief
(DotCode Solutions).

---

## ✨ Try it without installing anything

Open the deployed link → click **"Try Live Demo"** on the landing page. No
signup, no login. It instantly creates your own private sandbox company,
pre-loaded with sample clients, employees, invoices and a payroll run, so you
can click through every module immediately. Nothing you do there affects
anyone else's data.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | **React** + **Next.js 14** (App Router), JavaScript |
| Styling | **Tailwind CSS** (brand tokens pre-configured) |
| Database | **MySQL** |
| ORM | **Prisma** (typed queries, migrations, multi-tenant by design) |
| Auth | **JWT** in an httpOnly cookie (no third-party auth service) |
| Charts | **Recharts** |
| Animation | **Framer Motion** |
| PDF export | **html2canvas** + **jsPDF** (fully client-side) |

## Feature checklist (mapped to the problem statement)

| Module | Status |
|---|---|
| 1. Invoice Management — create/manage, client records, status tracking, history, PDF, shareable links | ✅ |
| 2. Custom Invoice Designer — saved templates, brand color/font/layout, logo toggle, live preview | ✅ |
| 3. Employee Management — profiles, departments, salary structure | ✅ |
| 4. Payroll Management — monthly runs, allowances/deductions, history, totals | ✅ |
| 5. Salary Slip Generation — professional slip view, PDF download, salary history | ✅ |
| 6. Dashboard & Reporting — revenue, invoice analytics, payroll expense, outstanding payments | ✅ |
| 7. User & Access Management — auth, role field (Admin/Manager/Employee), per-company isolation | ✅ |
| Bonus: demo mode without signup | ✅ |
| Bonus: mobile-responsive layout | ✅ |
| Bonus: multi-company support | ✅ (every table is scoped by company; this is also what powers the demo sandbox) |
| Bonus: AI insights, email delivery, QR codes, tax tables, audit logs | Not implemented — see *Where to go next* below |

## Project structure

```
paynexus/
├── prisma/
│   ├── schema.prisma        # ← source of truth for the database
│   └── seed.js               # creates one ready-to-use admin login
├── database/
│   └── README.md             # plain-English schema/ERD walkthrough
├── public/
│   ├── logo-full.svg          logo-icon.svg          logo-full-white.svg
├── src/
│   ├── app/
│   │   ├── page.js                     # landing page
│   │   ├── login/  signup/             # auth pages
│   │   ├── invoice/[token]/            # public, no-login invoice view
│   │   ├── dashboard/
│   │   │   ├── page.js                 # overview (KPIs + charts)
│   │   │   ├── invoices/               # list, new, [id] detail+edit
│   │   │   ├── invoice-designer/       # template manager + live preview
│   │   │   ├── clients/  employees/  departments/
│   │   │   ├── payroll/                # runs list + [id] run detail
│   │   │   ├── salary-slips/           # cross-run salary history
│   │   │   ├── reports/  settings/
│   │   └── api/                        # one route per resource (REST-ish)
│   ├── components/
│   │   ├── landing/    # Hero, AnimatedParagraph, NexusGraphic, etc.
│   │   ├── dashboard/  # Sidebar, Topbar, StatCard, Charts
│   │   ├── invoice/    # InvoicePreview, InvoiceItemsEditor
│   │   ├── payroll/    # SalarySlipPreview
│   │   └── ui/         # Button, Card, Input, Modal, DownloadPdfButton
│   ├── lib/
│   │   ├── prisma.js   # Prisma client singleton
│   │   ├── auth.js     # JWT sign/verify, password hashing, session cookie
│   │   ├── demoSeed.js  # clones sample data into a fresh company for "Try Demo"
│   │   └── format.js    # shared currency/date/total helpers
│   └── middleware.js     # protects /dashboard/*, redirects signed-in users away from /login
├── .env.example
├── DEPLOYMENT.md
└── README.md (this file)
```

Every page fetches its own data client-side from the matching `/api/*`
route — there's no prop-drilling or global state library, which keeps each
file readable on its own.

## Running it locally in VS Code

**Prerequisites:** Node.js 18.18+, and a MySQL database (local install, or a
free cloud one — see [`DEPLOYMENT.md`](./DEPLOYMENT.md)).

```bash
# 1. Open the folder in VS Code, then in its integrated terminal:
npm install

# 2. Copy the env template and fill in your DB connection string
cp .env.example .env
# DATABASE_URL="mysql://root:password@localhost:3306/paynexus"
# JWT_SECRET="any-long-random-string"

# 3. Create the tables
npm run db:push

# 4. (Optional) seed a ready-made login: admin@paynexus.app / admin123
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open **http://localhost:3000** — you'll land on the marketing page. Use
**Try Live Demo** for instant access, or **Sign up** to create your own
company from scratch.

**Recommended VS Code extensions:** *Prisma* (schema syntax highlighting),
*Tailwind CSS IntelliSense*, *ES7+ React/Redux/JS Snippets*.

> **Note on `npm install`:** the `postinstall` step runs `prisma generate`,
> which downloads a small database engine binary the first time. This needs
> a normal internet connection (it's blocked in some locked-down sandboxes,
> but works fine on a regular laptop, CI runner, or Vercel).

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full walkthrough — in short:
**Vercel** (free) for the app, **Aiven** (free) for MySQL, ~15 minutes start
to finish, and you get a public link to share with judges.

## Design notes

- Colors, the invoice/payroll-line-inspired logo mark, and typography all
  follow the brand brief: Navy `#0B1F4D` primary, white secondary, soft
  gray `#F8FAFC` background, `#E5E7EB` borders, `#1E293B` body text.
- The landing page hero and "why teams switch" section use a word-by-word
  scroll-reveal paragraph animation (`components/landing/AnimatedParagraph.js`),
  built with Framer Motion.
- PDF generation is entirely client-side (snapshot the on-screen invoice/slip
  and save it as a PDF), so what you see is exactly what gets downloaded —
  and it needs no server-side rendering service or extra infrastructure.

## Where to go next (ideas for extending this)

- **Automated email delivery** — wire up Resend/Nodemailer in the invoice
  "Send" action.
- **QR code on invoices** — `qrcode` npm package, encode the share link.
- **Audit log** — a single `ActivityLog` table keyed by `companyId`, written
  to from each API route.
- **Tax tables / multi-currency** — extend `InvoiceTemplate`/`Invoice` with a
  currency field and a small lookup table.

These were left out to keep the submission's codebase easy to read end to
end rather than spread thin across every possible bonus feature.
