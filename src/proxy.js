import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';

  // Protect /learning-portal routes
  if (nextUrl.pathname.startsWith('/learning-portal')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }

  // Protect /admin routes — admin only
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/learning-portal/:path*', '/admin/:path*'],
};
