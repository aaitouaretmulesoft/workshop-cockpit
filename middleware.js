import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'wc_admin';

export function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // Login page itself must stay reachable.
  if (pathname === '/admin/login') return NextResponse.next();

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // No password configured → send to login so the operator sees the config error.
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    url.searchParams.set('next', pathname + search);
    url.searchParams.set('error', 'missing-config');
    return NextResponse.redirect(url);
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  url.searchParams.set('next', pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};
