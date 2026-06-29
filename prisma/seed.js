/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Drop an optional header row like "username,password"
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

async function main() {
  const existing = await prisma.credential.count();
  if (existing > 0) {
    console.log(`Skip seed — ${existing} credentials already in the database.`);
    return;
  }

  const csvPath = path.join(__dirname, '..', 'credentials.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`credentials.csv not found at ${csvPath}`);
  }

  const records = parseCsv(fs.readFileSync(csvPath, 'utf8'));

  if (records.length === 0) {
    console.log('credentials.csv is empty — nothing to seed.');
    return;
  }

  // skipDuplicates guards against running the seed twice with overlapping CSVs.
  const result = await prisma.credential.createMany({
    data: records,
    skipDuplicates: true,
  });

  console.log(`Seeded ${result.count} credential(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
