import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AUTH_COOKIE_NAME, signAdminToken } from '@/lib/auth';

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';

  if (!adminEmail || !adminPasswordHash) {
    console.error('ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not configured.');
    return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 500 });
  }

  if (email !== adminEmail) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = await signAdminToken(email);
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
