import path from "node:path";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (raw && !raw.startsWith("file:")) {
    return raw;
  }

  const relative = raw?.replace(/^file:/, "") ?? path.join("prisma", "dev.db");
  const absolute = path.isAbsolute(relative)
    ? relative
    : path.resolve(process.cwd(), relative);
  return `file:${absolute}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
