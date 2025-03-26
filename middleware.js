// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export function middleware(request) {
//   const path = request.nextUrl.pathname;
//   const token = request.cookies.get('authtoken')?.value;

//   const publicPaths = ['/login',  '/'];

//   if (publicPaths.includes(path)) {
//     return NextResponse.next();
//   }

//   if (!token && path !== '/login') {
//     return NextResponse.redirect(new URL('/login', request.nextUrl));
//   }
// }

// export const config = {
//   matcher: ['/home', '/author'], // Routes to protect
// };

// aactuall
import {clerkMiddleware} from "@clerk/nextjs/server"

export default clerkMiddleware({
  publicRoutes: ["/login", "/"], // Routes that don't require authentication

  afterAuth(auth, req) {
    const url = new URL(req.url);

    // If the user is NOT logged in and tries to access a protected route, redirect to /login
    if (!auth.userId && !auth.isPublicRoute) {
      return Response.redirect(new URL("/login", req.url));
    }

    // If user is logged in and tries to access /login, redirect them to /home
    if (auth.userId && url.pathname === "/login") {
      return Response.redirect(new URL("/home", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // Apply middleware to all routes except static assets
};

