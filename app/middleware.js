import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authtoken')?.value;

  const publicPaths = ['/login',  '/'];

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  if (!token && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: ['/home', '/author'], // Routes to protect
};