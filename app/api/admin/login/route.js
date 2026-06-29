import { NextResponse } from 'next/server';
import {
  adminPassword,
  adminUsername,
  safeAdminNext,
} from '@/lib/admin-auth';
import { setAdminSession } from '@/lib/admin-session';

export async function POST(request) {
  const formData = await request.formData();
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = safeAdminNext(formData.get('next'));
  const expectedPass = adminPassword();
  const expectedUser = adminUsername();

  if (!expectedPass) {
    return NextResponse.redirect(
      new URL(
        `/admin/login?next=${encodeURIComponent(next)}&error=missing-config`,
        request.url
      )
    );
  }

  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.redirect(
      new URL(
        `/admin/login?next=${encodeURIComponent(next)}&error=1`,
        request.url
      )
    );
  }

  await setAdminSession(password);
  return NextResponse.redirect(new URL(next, request.url));
}
