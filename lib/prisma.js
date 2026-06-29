import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

/** Neon on Vercel may expose DATABASE_URL or legacy POSTGRES_PRISMA_URL. */
function resolveDatabaseUrl() {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  if (!raw) {
    throw new Error(
      'DATABASE_URL is not set. Connect Neon to the Vercel project and redeploy.'
    );
  }

  // channel_binding=require breaks some serverless Node runtimes.
  return raw
    .replace(/([?&])channel_binding=require&?/g, '$1')
    .replace(/&channel_binding=require/g, '')
    .replace(/\?$/, '');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
