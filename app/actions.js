'use server';

import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';

const SESSION_COOKIE = 'wc_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function normalize(name) {
  return String(name ?? '').trim();
}

async function readSessionId() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value || null;
}

async function writeSessionId(id) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/** Server component helper — returns the credential already claimed by this browser, or null. */
export async function getMyCredential() {
  const id = await readSessionId();
  if (!id) return null;
  try {
    return await prisma.credential.findFirst({ where: { claimedBy: id } });
  } catch (err) {
    console.error('[getMyCredential] failed:', err);
    return null;
  }
}

export async function claimCredential(_prevState, formData) {
  const firstName = normalize(formData.get('firstName'));
  const lastName = normalize(formData.get('lastName'));

  // Cookie-first: any request from this browser returns the same credential,
  // regardless of the name typed. Set/refresh the cookie before any branch
  // so even an empty form locks the browser to its existing credential.
  let sessionId = await readSessionId();
  if (!sessionId) sessionId = randomUUID();
  await writeSessionId(sessionId);

  try {
    // Short-circuit: this browser already owns a credential.
    const existingForBrowser = await prisma.credential.findFirst({
      where: { claimedBy: sessionId },
    });
    if (existingForBrowser) {
      return ok(existingForBrowser, true);
    }

    if (!firstName || !lastName) {
      return {
        status: 'error',
        message: 'Merci de renseigner votre prénom et votre nom.',
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Race-safe double-check inside the transaction.
      const lockedByBrowser = await tx.credential.findFirst({
        where: { claimedBy: sessionId },
      });
      if (lockedByBrowser) {
        return { credential: lockedByBrowser, reused: true };
      }

      // Same name from a different browser → reuse and bind to this browser
      // (so the participant can keep accessing it from this device).
      const byName = await tx.credential.findFirst({
        where: {
          AND: [
            { assignedToFirstName: { equals: firstName, mode: 'insensitive' } },
            { assignedToLastName: { equals: lastName, mode: 'insensitive' } },
          ],
        },
        orderBy: { assignedAt: 'asc' },
      });
      if (byName) {
        if (!byName.claimedBy) {
          await tx.credential.update({
            where: { id: byName.id },
            data: { claimedBy: sessionId },
          });
        }
        return { credential: byName, reused: true };
      }

      // Claim the next available row. updateMany + count check = optimistic lock.
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
            claimedBy: sessionId,
          },
        });
        if (updated.count === 1) {
          const claimed = await tx.credential.findUnique({
            where: { id: next.id },
          });
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

    return ok(result.credential, result.reused);
  } catch (err) {
    console.error('claimCredential failed:', err);
    return {
      status: 'error',
      message: 'Erreur technique. Merci de réessayer dans quelques secondes.',
    };
  }
}

function ok(credential, reused) {
  return {
    status: 'ok',
    reused,
    credential: {
      username: credential.username,
      password: credential.password,
    },
    firstName: credential.assignedToFirstName,
    lastName: credential.assignedToLastName,
  };
}
