'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function resetCredential(formData) {
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, message: 'ID invalide.' };
  }

  await prisma.credential.update({
    where: { id },
    data: {
      assignedToFirstName: null,
      assignedToLastName: null,
      assignedAt: null,
      claimedBy: null,
    },
  });

  revalidatePath('/admin');
  return { ok: true };
}

export async function resetAllAction(_prevState, _formData) {
  try {
    const { count } = await prisma.credential.updateMany({
      data: {
        assignedToFirstName: null,
        assignedToLastName: null,
        assignedAt: null,
        claimedBy: null,
      },
    });
    revalidatePath('/admin');
    revalidatePath('/');
    return { status: 'ok', count };
  } catch (err) {
    console.error('resetAll failed:', err);
    return {
      status: 'error',
      message: 'Échec du reset. Voir les logs serveur.',
    };
  }
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const first = lines[0].toLowerCase();
  const hasHeader =
    first.startsWith('username') ||
    first.startsWith('user,') ||
    first.startsWith('"username"');
  const start = hasHeader ? 1 : 0;

  const rows = [];
  const seen = new Set();
  for (let i = start; i < lines.length; i += 1) {
    const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
    const [username, password] = parts;
    if (!username || !password) continue;
    if (seen.has(username)) continue;
    seen.add(username);
    rows.push({ username, password });
  }
  return rows;
}

export async function uploadCsvAction(_prevState, formData) {
  const file = formData.get('file');
  if (!file || typeof file === 'string' || typeof file.text !== 'function') {
    return { status: 'error', message: 'Aucun fichier reçu.' };
  }
  if (file.size === 0) {
    return { status: 'error', message: 'Fichier vide.' };
  }
  if (file.size > 1_000_000) {
    return { status: 'error', message: 'Fichier trop volumineux (1 Mo max).' };
  }

  let rows;
  try {
    const text = await file.text();
    rows = parseCsv(text);
  } catch (err) {
    console.error('uploadCsv parse failed:', err);
    return { status: 'error', message: 'Impossible de lire le CSV.' };
  }

  if (rows.length === 0) {
    return {
      status: 'error',
      message:
        'Aucune ligne valide. Format attendu : `username,password` (avec ou sans en-tête).',
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      await tx.credential.deleteMany({});
      const created = await tx.credential.createMany({
        data: rows,
        skipDuplicates: true,
      });
      return created.count;
    });
    revalidatePath('/admin');
    revalidatePath('/');
    return { status: 'ok', count: result };
  } catch (err) {
    console.error('uploadCsv write failed:', err);
    return {
      status: 'error',
      message: 'Échec de l’écriture en base. Voir les logs serveur.',
    };
  }
}
