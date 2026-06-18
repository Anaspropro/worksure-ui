import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/wallet",
  "/profile",
  "/jobs",
  "/contracts",
  "/kyc",
  "/reviews",
  "/notifications",
];
const AUTH_PREFIXES = ["/auth/login", "/auth/register"];
const ADMIN_PREFIX = "/admin";

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PREFIX);
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token");

  const API_URL =
    process.env.API_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!API_URL && (isProtectedPath(pathname) || isAuthPath(pathname))) {
    const response = NextResponse.redirect(new URL("/auth/login?error=no_api_url", request.url));
    response.cookies.set("token", "", { maxAge: 0 });
    response.cookies.set("refresh_token", "", { maxAge: 0 });
    response.cookies.set("auth_present", "", { maxAge: 0 });
    return response;
  }

  if (isProtectedPath(pathname) || (isAuthPath(pathname) && token?.value)) {
    if (!token?.value) {
      return NextResponse.redirect(new URL("/auth/login?error=no_token", request.url));
    }

    try {
      const clientIp = request.headers.get("x-forwarded-for") || "";
      const userAgent = request.headers.get("user-agent") || "";
      const customHeaders: Record<string, string> = { 
        Authorization: `Bearer ${token.value}` 
      };
      
      if (clientIp) customHeaders["x-forwarded-for"] = clientIp;
      if (userAgent) customHeaders["user-agent"] = userAgent;

      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: customHeaders,
        cache: "no-store",
      });

      if (!meRes.ok) {
        if (meRes.status === 401 || meRes.status === 403) {
          const response = NextResponse.redirect(new URL(`/auth/login?error=me_not_ok&status=${meRes.status}`, request.url));
          response.cookies.set("token", "", { maxAge: 0 });
          response.cookies.set("refresh_token", "", { maxAge: 0 });
          response.cookies.set("auth_present", "", { maxAge: 0 });
          return response;
        }
        // If the server returns 429 Too Many Requests or 500, do not log the user out.
        // Let the request pass through so the client can handle the API error gracefully.
        return NextResponse.next();
      }

      const body = await meRes.json();
      const currentRole = body?.data?.role;

      if (isAuthPath(pathname) && currentRole) {
        return NextResponse.redirect(new URL(getDashboardPathForRole(currentRole), request.url));
      }

      if (isAdminPath(pathname) && currentRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      console.error("Middleware fetch error:", e);
      // Let the request pass through so the client can handle the API error gracefully
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/contracts/:path*",
    "/kyc/:path*",
    "/reviews/:path*",
    "/notifications/:path*",
    "/auth/:path*",
  ],
};
