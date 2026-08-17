import path from "node:path";
import { PrismaClient } from "@prisma/client";

const projectRoot = path.resolve(__dirname, "../..");
const databaseUrl = `file:${path.join(projectRoot, "prisma", "dev.db")}`;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
