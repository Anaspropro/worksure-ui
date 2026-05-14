import type { NextRequest } from "next/server";
import { proxy } from "./src/proxy";

export function middleware(request: NextRequest) {
  return proxy(request);
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
