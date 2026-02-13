import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const log =
  process.env.NODE_ENV === "development" ? (["query", "error", "warn"] as const) : (["error"] as const);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  (process.env.PRISMA_ACCELERATE_URL
    ? new PrismaClient({
        accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
        log: [...log],
      })
    : new PrismaClient({
        adapter,
        log: [...log],
      }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

