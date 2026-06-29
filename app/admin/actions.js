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

export async function resetAll() {
  await prisma.credential.updateMany({
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
