import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "token";
const ROLE_KEY = "user_role";

function getDashboardPathForRole(role: string): string {
  switch (role) {
    case "CLIENT":
      return "/dashboard/client";
    case "ARTISAN":
      return "/dashboard/artisan";
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
}

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get(TOKEN_KEY)?.value ||
    request.cookies.get("auth_token")?.value;
  const role = request.cookies.get(ROLE_KEY)?.value;
  const pathname = request.nextUrl.pathname;

  // 1. If not authenticated, protect authenticated routes
  const isAuthenticatedRoute = 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/contracts") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/kyc") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/reviews");

  if (isAuthenticatedRoute && !token) {
    // Redirect to login if trying to access protected route without a token
    const loginUrl = new URL("/auth/login", request.url);
    // Keep reference of where they were going
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated, prevent accessing auth pages or base url (redirect to role-specific dashboard)
  const isAuthPage = 
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password") ||
    pathname.startsWith("/auth/reset-password");

  if (isAuthPage && token && role) {
    const dashboardPath = getDashboardPathForRole(role);
    // Only redirect if they are not already going to their correct dashboard
    if (pathname !== dashboardPath) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  // 3. Role-based route enforcement
  // Admins trying to access non-admin pages
  const isUserOnlyRoute = 
    pathname.startsWith("/dashboard/client") || 
    pathname.startsWith("/dashboard/artisan") ||
    (pathname.startsWith("/dashboard") && pathname !== "/dashboard") ||
    pathname.startsWith("/kyc") ||
    pathname.startsWith("/reviews");

  if (isUserOnlyRoute && token && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Clients/Artisans trying to access admin pages
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute && token && role && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardPathForRole(role), request.url));
  }

  // Client vs Artisan dashboard restrictions
  if (pathname.startsWith("/dashboard/client") && token && role === "ARTISAN") {
    return NextResponse.redirect(new URL("/dashboard/artisan", request.url));
  }
  if (pathname.startsWith("/dashboard/artisan") && token && role === "CLIENT") {
    return NextResponse.redirect(new URL("/dashboard/client", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (manifest file)
     * - sw.js (service worker)
     * - workbox-* (workbox service worker dependencies)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-).*)",
  ],
};
