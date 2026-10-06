import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/signup'];

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Login and signup pages are public
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not logged in -> go to login, and come back here afterwards
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdmin = token.role?.toLowerCase() === 'admin';

  // /admin/* -> admin only. Logged-in non-admins go to the home page.
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // /dashboard/list-property/* -> any logged-in user (user or admin)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/list-property/:path*'],
};