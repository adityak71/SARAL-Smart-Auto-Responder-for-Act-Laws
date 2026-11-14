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

  // 3. Role-Based Access Control (RBAC) Enforcement
  if (sessionCookie) {
    const session = decodeJwtPayload(sessionCookie);

    // If token is expired, redirect to login
    if (session?.exp && Math.floor(Date.now() / 1000) > session.exp) {
      const response = NextResponse.redirect(new URL("/login", request.url));
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
