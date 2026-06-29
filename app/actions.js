'use server';

import { prisma } from '@/lib/prisma';

function normalize(name) {
  return String(name ?? '').trim();
}
function key(name) {
  return normalize(name).toLowerCase();
}

export async function claimCredential(_prevState, formData) {
  const firstName = normalize(formData.get('firstName'));
  const lastName = normalize(formData.get('lastName'));

  if (!firstName || !lastName) {
    return {
      status: 'error',
      message: 'Merci de renseigner votre prénom et votre nom.',
    };
  }

  const firstLower = key(firstName);
  const lastLower = key(lastName);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Has this person already claimed an account? Match case-insensitively
      //    on the stored names so "Jean Dupont" == "jean DUPONT".
      const existing = await tx.credential.findFirst({
        where: {
          AND: [
            { assignedToFirstName: { equals: firstName, mode: 'insensitive' } },
            { assignedToLastName: { equals: lastName, mode: 'insensitive' } },
          ],
        },
        orderBy: { assignedAt: 'asc' },
      });

      if (existing) {
        return { credential: existing, reused: true };
      }

      // 2. Claim the next available row. updateMany + count check is our
      //    optimistic lock — if a concurrent request grabbed the same row,
      //    count is 0 and we retry by re-selecting.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const next = await tx.credential.findFirst({
          where: { assignedToFirstName: null },
          orderBy: { id: 'asc' },
          select: { id: true },
        });

        if (!next) return { credential: null, reused: false };

        const updated = await tx.credential.updateMany({
          where: { id: next.id, assignedToFirstName: null },
          data: {
            assignedToFirstName: firstName,
            assignedToLastName: lastName,
            assignedAt: new Date(),
          },
        });

        if (updated.count === 1) {
          const claimed = await tx.credential.findUnique({ where: { id: next.id } });
          return { credential: claimed, reused: false };
        }
      }

      return { credential: null, reused: false };
    });

    if (!result.credential) {
      return {
        status: 'empty',
        message:
          "Plus aucun compte disponible. Merci de prévenir l'animateur de la session.",
      };
    }

    return {
      status: 'ok',
      reused: result.reused,
      credential: {
        username: result.credential.username,
        password: result.credential.password,
      },
      firstName,
      lastName,
    };
  } catch (err) {
    console.error('claimCredential failed:', err);
    return {
      status: 'error',
      message: 'Erreur technique. Merci de réessayer dans quelques secondes.',
    };
  }
}
