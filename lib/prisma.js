import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function sanitizeUrl(raw) {
  let url = raw
    .replace(/([?&])channel_binding=require&?/g, '$1')
    .replace(/&channel_binding=require/g, '')
    .replace(/\?$/, '');

  // Serverless-friendly defaults for Neon pooler.
  if (!url.includes('connect_timeout=')) {
    url += url.includes('?') ? '&connect_timeout=15' : '?connect_timeout=15';
  }
  if (url.includes('-pooler.') && !url.includes('pgbouncer=')) {
    url += '&pgbouncer=true';
  }

  return url;
}

/** Neon on Vercel may expose DATABASE_URL or legacy POSTGRES_* names. */
export function resolveDatabaseUrl() {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  if (!raw) {
    throw new Error(
      'DATABASE_URL is not set. Connect Neon to the Vercel project and redeploy.'
    );
  }

  return sanitizeUrl(raw);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: resolveDatabaseUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = prisma;
