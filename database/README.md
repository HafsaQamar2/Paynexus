# Database

PayNexus uses **MySQL** as the database engine, with **Prisma** as the ORM/query
layer. The canonical schema lives in [`/prisma/schema.prisma`](../prisma/schema.prisma) —
this file is a plain-English map of the same tables, for anyone who wants the
big picture without reading Prisma syntax.

Every business table is scoped by `companyId`. That one design decision is what
makes multi-company support *and* the no-signup "Try Live Demo" sandbox possible:
a demo click just clones the seed data under a brand-new, throwaway `Company`
row, so every visitor gets an isolated workspace and nobody can see or edit
anyone else's data.

## Tables

| Table             | Purpose                                                                 |
|-------------------|--------------------------------------------------------------------------|
| `Company`         | One row per business/tenant. Holds brand name, logo, primary color.     |
| `User`            | Login accounts. Belongs to a `Company`. Role: `ADMIN` / `MANAGER` / `EMPLOYEE`. |
| `Client`          | A business's customers — who invoices get billed to.                    |
| `InvoiceTemplate` | Saved designs from the Invoice Designer (colors, font, layout, logo).   |
| `Invoice`         | One invoice. Has a unique `shareToken` used for the public `/invoice/[token]` link. |
| `InvoiceItem`     | Line items (description, quantity, rate) belonging to an `Invoice`.     |
| `Department`      | Simple grouping for employees (Engineering, Sales, etc).                |
| `Employee`        | Staff records — salary, designation, department, bank details.          |
| `PayrollRun`      | One payroll cycle for a given month/year, with a `DRAFT`/`PROCESSED` status. |
| `PayrollItem`     | Per-employee result of a `PayrollRun`: basic + allowances − deductions = net pay. A "salary slip" is just this row rendered as a document. |

## Relationships at a glance

```
Company ──┬── User
          ├── Client ──────────────── Invoice ── InvoiceItem
          ├── InvoiceTemplate ──────/
          ├── Department ── Employee ── PayrollItem
          └── PayrollRun ──────────────────┘
```

## Why no separate `SalarySlip` table?

A salary slip is a **view** of a `PayrollItem` (basic + allowances + deductions +
the related employee/run), not new data. Generating it as a PDF is purely a
front-end rendering step — keeping it that way avoids a redundant table that
could drift out of sync with the payroll numbers it's supposed to represent.

## Applying the schema

```bash
npm run db:push     # pushes the schema in prisma/schema.prisma to your MySQL database
npm run db:studio   # optional: browse your data in a GUI at localhost:5555
```

See [`/DEPLOYMENT.md`](../DEPLOYMENT.md) for where to get a free MySQL database.
