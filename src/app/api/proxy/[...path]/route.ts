import { NextRequest, NextResponse } from "next/server";

function resolveApiUrl(): string {
  const envVal =
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  const candidates = envVal
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);

  if (candidates.length === 0) {
    return "http://localhost:8000";
  }

  // If in production or an HTTPS remote URL is present, prefer HTTPS
  const httpsCandidate = candidates.find((c) => c.startsWith("https://"));
  if (httpsCandidate) {
    return httpsCandidate;
  }

  return candidates[0];
}

const TOKEN_KEY = "token";
const SESSION_HINT_KEY = "auth_present";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const MAX_BODY_SIZE = 3 * 1024 * 1024; // 3MB

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

function buildUpstreamUrl(pathSegments: string[], request: NextRequest) {
  const baseUrl = resolveApiUrl();
  const upstreamPath = pathSegments.join("/");
  return `${baseUrl}/${upstreamPath}${request.nextUrl.search}`;
}

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const url = buildUpstreamUrl(path, request);

  const contentLength = parseInt(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json(
      { message: "File too large. Maximum allowed size is 3MB." },
      { status: 413 },
    );
  }

  const headers = new Headers();
  const token = request.cookies.get(TOKEN_KEY)?.value;

  request.headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();

    if (
      normalizedKey === "host" ||
      normalizedKey === "connection" ||
      normalizedKey === "content-length" ||
      normalizedKey === "cookie" ||
      normalizedKey === "authorization" ||
      normalizedKey === "if-none-match" ||
      normalizedKey === "if-modified-since"
    ) {
      return;
    }

    headers.set(key, value);
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(url, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : Buffer.from(await request.arrayBuffer()),
      cache: "no-store",
    });
  } catch (error: any) {
    console.error(`[API Proxy Error] Failed to reach upstream ${url}:`, error?.message || error);
    return NextResponse.json(
      {
        statusCode: 502,
        message: `Unable to reach backend server (${resolveApiUrl()}). Please ensure the backend is running.`,
      },
      { status: 502 },
    );
  }

  const contentType = upstreamResponse.headers.get("content-type");
  const body = await upstreamResponse.arrayBuffer();
  
  const responseHeaders = new Headers();
  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }
  // Prevent caching of proxied responses
  responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  responseHeaders.set("Pragma", "no-cache");
  responseHeaders.set("Expires", "0");

  const response = new NextResponse(body.byteLength ? body : null, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });

  const isHttps = request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:";
  const isSecureCookie = process.env.NODE_ENV === "production" && isHttps;

  const shouldPersistSession =
    upstreamResponse.ok &&
    path[0] === "auth" &&
    (path[1] === "login" || path[1] === "register");
  const shouldClearSession =
    upstreamResponse.status === 401 || (path[0] === "auth" && path[1] === "logout");

  if (shouldPersistSession) {
    const payload = body.byteLength
      ? (JSON.parse(Buffer.from(body).toString("utf8")) as any)
      : null;
    const accessToken = payload?.data?.accessToken ?? payload?.accessToken;
    const userRole = payload?.data?.user?.role ?? payload?.user?.role;

    if (accessToken) {
      response.cookies.set(TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      response.cookies.set(SESSION_HINT_KEY, "1", {
        httpOnly: false,
        secure: isSecureCookie,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      if (userRole) {
        response.cookies.set("user_role", userRole, {
          httpOnly: false,
          secure: isSecureCookie,
          sameSite: "lax",
          path: "/",
          maxAge: SESSION_MAX_AGE,
        });
      }
      const userMeta = payload?.data?.user ?? payload?.user;
      if (userMeta) {
        response.cookies.set(
          "user_session",
          encodeURIComponent(
            JSON.stringify({
              id: userMeta.id,
              role: userMeta.role,
              name: userMeta.name,
              email: userMeta.email,
              avatarUrl: userMeta.avatarUrl,
            }),
          ),
          {
            httpOnly: false,
            secure: isSecureCookie,
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_MAX_AGE,
          },
        );
      }
    }
  }

  if (shouldClearSession) {
    response.cookies.set(TOKEN_KEY, "", {
      httpOnly: true,
      secure: isSecureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(SESSION_HINT_KEY, "", {
      httpOnly: false,
      secure: isSecureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("user_session", "", {
      httpOnly: false,
      secure: isSecureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("user_role", "", {
      httpOnly: false,
      secure: isSecureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}
