import { prisma } from "./prisma";

// Creates a brand new "Demo" company pre-loaded with realistic sample
// data so a visitor can explore every module immediately, with no
// signup required. Each visitor gets their own isolated sandbox.
export async function createDemoWorkspace() {
  const company = await prisma.company.create({
    data: {
      name: "Demo Workspace",
      isDemo: true,
      primaryColor: "#0B1F4D",
    },
  });

  const template = await prisma.invoiceTemplate.create({
    data: {
      companyId: company.id,
      name: "Classic Navy",
      primaryColor: "#0B1F4D",
      accentColor: "#F8FAFC",
      fontFamily: "Inter",
      layout: "classic",
      isDefault: true,
    },
  });

  const [clientA, clientB, clientC] = await Promise.all([
    prisma.client.create({
      data: { companyId: company.id, name: "Horizon Retail Co.", email: "billing@horizonretail.com", phone: "+92 300 1112222", address: "12 Market Road, Lahore" },
    }),
    prisma.client.create({
      data: { companyId: company.id, name: "BlueCrest Logistics", email: "accounts@bluecrest.com", phone: "+92 321 5556666", address: "Plot 8, Industrial Area, Karachi" },
    }),
    prisma.client.create({
      data: { companyId: company.id, name: "Atlas Apparel", email: "finance@atlasapparel.com", phone: "+92 333 7778888", address: "45 Mall Road, Islamabad" },
    }),
  ]);

  const today = new Date();
  const inDays = (n) => new Date(today.getTime() + n * 86400000);

  await prisma.invoice.create({
    data: {
      companyId: company.id, clientId: clientA.id, templateId: template.id,
      invoiceNumber: "INV-1001", dueDate: inDays(14), status: "PAID", taxPercent: 5,
      items: { create: [{ description: "Brand strategy consulting", quantity: 1, rate: 1500 }, { description: "Logo design package", quantity: 1, rate: 600 }] },
    },
  });
  await prisma.invoice.create({
    data: {
      companyId: company.id, clientId: clientB.id, templateId: template.id,
      invoiceNumber: "INV-1002", dueDate: inDays(7), status: "SENT", taxPercent: 5,
      items: { create: [{ description: "Fleet management software - monthly", quantity: 1, rate: 2200 }] },
    },
  });
  await prisma.invoice.create({
    data: {
      companyId: company.id, clientId: clientC.id, templateId: template.id,
      invoiceNumber: "INV-1003", dueDate: inDays(-5), status: "OVERDUE", taxPercent: 0,
      items: { create: [{ description: "Bulk apparel order #44", quantity: 200, rate: 8.5 }] },
    },
  });
  await prisma.invoice.create({
    data: {
      companyId: company.id, clientId: clientA.id, templateId: template.id,
      invoiceNumber: "INV-1004", dueDate: inDays(20), status: "DRAFT", taxPercent: 5,
      items: { create: [{ description: "Q3 marketing retainer", quantity: 1, rate: 3000 }] },
    },
  });

  const engineering = await prisma.department.create({ data: { companyId: company.id, name: "Engineering" } });
  const sales = await prisma.department.create({ data: { companyId: company.id, name: "Sales" } });
  const hr = await prisma.department.create({ data: { companyId: company.id, name: "Human Resources" } });

  const employees = await Promise.all([
    prisma.employee.create({ data: { companyId: company.id, departmentId: engineering.id, name: "Ayesha Khan", email: "ayesha.khan@demo.paynexus.app", designation: "Senior Software Engineer", baseSalary: 3200 } }),
    prisma.employee.create({ data: { companyId: company.id, departmentId: engineering.id, name: "Bilal Ahmed", email: "bilal.ahmed@demo.paynexus.app", designation: "Backend Developer", baseSalary: 2600 } }),
    prisma.employee.create({ data: { companyId: company.id, departmentId: sales.id, name: "Sara Malik", email: "sara.malik@demo.paynexus.app", designation: "Sales Manager", baseSalary: 2800 } }),
    prisma.employee.create({ data: { companyId: company.id, departmentId: hr.id, name: "Usman Tariq", email: "usman.tariq@demo.paynexus.app", designation: "HR Executive", baseSalary: 2100 } }),
  ]);

  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const payrollRun = await prisma.payrollRun.create({
    data: {
      companyId: company.id,
      month: lastMonthDate.getMonth() + 1,
      year: lastMonthDate.getFullYear(),
      status: "PROCESSED",
      processedAt: lastMonthDate,
      items: {
        create: employees.map((e) => ({
          employeeId: e.id,
          basic: e.baseSalary,
          allowances: Math.round(e.baseSalary * 0.1),
          deductions: Math.round(e.baseSalary * 0.05),
          netSalary: Math.round(e.baseSalary * 1.05),
        })),
      },
    },
  });

  return company.id;
}
