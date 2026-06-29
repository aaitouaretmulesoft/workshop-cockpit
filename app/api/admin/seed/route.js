import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const first = lines[0].toLowerCase();
  const rows = first.startsWith('username') ? lines.slice(1) : lines;
  return rows.map((line, idx) => {
    const [username, password] = line.split(',').map((s) => s?.trim());
    if (!username || !password) {
      throw new Error(`Invalid row ${idx + 1}: "${line}"`);
    }
    return { username, password };
  });
}

async function handler(request) {
  const secret = process.env.SEED_SECRET;
  if (secret) {
    const provided =
      request.headers.get('x-seed-secret') ??
      new URL(request.url).searchParams.get('secret');
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const existing = await prisma.credential.count();
  if (existing > 0) {
    return NextResponse.json({
      seeded: 0,
      existing,
      message: 'Table not empty — seed skipped.',
    });
  }

  const csvPath = path.join(process.cwd(), 'credentials.csv');
  if (!fs.existsSync(csvPath)) {
    return NextResponse.json(
      { error: 'credentials.csv not found at project root' },
      { status: 500 }
    );
  }

  const records = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  if (records.length === 0) {
    return NextResponse.json({ seeded: 0, message: 'CSV empty.' });
  }

  const result = await prisma.credential.createMany({
    data: records,
    skipDuplicates: true,
  });

  return NextResponse.json({ seeded: result.count });
}

export { handler as GET, handler as POST };
