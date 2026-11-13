import { NextResponse } from "next/server";

/**
 * Next.js Edge Auth Guard & RBAC Middleware
 * Intercepts requests to protected pages before rendering.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("saral_session")?.value;

  // 1. Protected Routes that require authenticated session
  const protectedPaths = ["/dashboard", "/profile", "/file-rti", "/appeal"];
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If visiting protected page without valid cookie, redirect to /login
  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth Routes (/login, /signup) - if already logged in, redirect to /dashboard
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher configuration: run middleware only on relevant routes
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/file-rti/:path*",
    "/file-rti",
    "/appeal/:path*",
    "/appeal",
    "/login",
    "/signup",
  ],
};
