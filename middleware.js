import { NextResponse } from "next/server";

/**
 * Decode JWT payload in Edge runtime without external crypto libraries
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

/**
 * Next.js Edge Auth Guard & RBAC Middleware
 * Intercepts requests to protected pages before rendering with role-based policies.
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
  if (isProtected) {
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = decodeJwtPayload(sessionCookie);

    // If token is missing, invalid, or expired, clear cookie and redirect to login
    if (!session || (session?.exp && Math.floor(Date.now() / 1000) > session.exp)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("saral_session");
      return response;
    }

    const userRole = (session?.role || "CITIZEN").toUpperCase();

    // Citizen-exclusive routes: Filing RTI and First Appeals pertain strictly to applicants
    const isCitizenOnly =
      pathname === "/file-rti" ||
      pathname.startsWith("/file-rti/") ||
      pathname === "/appeal" ||
      pathname.startsWith("/appeal/");

    if (isCitizenOnly && userRole !== "CITIZEN") {
      // Officer or Admin attempting to file RTI as applicant is redirected to official workspace
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Redirect logged-in users away from /login or /signup to /dashboard
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && sessionCookie) {
    const session = decodeJwtPayload(sessionCookie);
    if (session && (!session.exp || Math.floor(Date.now() / 1000) <= session.exp)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Matcher configuration: run middleware on protected routes and auth pages
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
