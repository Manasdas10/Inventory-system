import { PrismaClient } from "@prisma/client";

// GLOBAL TYPE
const globalForPrisma =
  globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

// CREATE PRISMA CLIENT
export const prisma =
  globalForPrisma.prisma ??

  new PrismaClient({
    log: [
      "query",
      "info",
      "warn",
      "error",
    ],

    errorFormat: "pretty",
  });

// PREVENT MULTIPLE INSTANCES IN DEV
if (
  process.env.NODE_ENV !== "production"
) {
  globalForPrisma.prisma = prisma;
}