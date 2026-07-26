import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthed = await verifyAdminToken(token);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin') && !isLoginPage;
  const isAdminApi = pathname.startsWith('/api/admin');

  if ((isAdminPage || isAdminApi) && !isAuthed) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && isAuthed) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
