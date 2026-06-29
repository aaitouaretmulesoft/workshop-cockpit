'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_COOKIE = 'wc_admin';

function safeNext(value) {
  const v = String(value ?? '/admin');
  return v.startsWith('/admin') ? v : '/admin';
}

export async function signIn(formData) {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = safeNext(formData.get('next'));

  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedPass) {
    redirect(
      `/admin/login?next=${encodeURIComponent(next)}&error=missing-config`
    );
  }

  if (username !== expectedUser || password !== expectedPass) {
    redirect(`/admin/login?next=${encodeURIComponent(next)}&error=1`);
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h shift
  });

  redirect(next);
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}
