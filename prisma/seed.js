// Run with: npm run db:seed
// Creates one ready-to-use company + admin login so you can sign in
// immediately after setting up a fresh database, without going
// through the signup form.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin@paynexus.app" } });
  if (existing) {
    console.log("Seed admin already exists. Skipping.");
    return;
  }

  const company = await prisma.company.create({
    data: { name: "PayNexus Sample Co.", primaryColor: "#0B1F4D" },
  });

  await prisma.user.create({
    data: {
      companyId: company.id,
      name: "Admin User",
      email: "admin@paynexus.app",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  await prisma.invoiceTemplate.create({
    data: {
      companyId: company.id,
      name: "Classic Navy",
      primaryColor: "#0B1F4D",
      accentColor: "#F8FAFC",
      isDefault: true,
    },
  });

  console.log("Seed complete.");
  console.log("Login with: admin@paynexus.app / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
