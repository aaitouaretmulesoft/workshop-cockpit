export const ADMIN_COOKIE = 'wc_admin';

export function adminUsername() {
  return process.env.ADMIN_USERNAME || 'admin';
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function safeAdminNext(value) {
  const v = String(value ?? '/admin');
  return v.startsWith('/admin') ? v : '/admin';
}
