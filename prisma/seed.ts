import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@sbw-digital.local";
  const password = "Admin123!";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "Administrator SBW",
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin development berhasil dibuat:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });