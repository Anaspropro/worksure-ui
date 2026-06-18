import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

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
  if (!API_URL) {
    throw new Error("API_URL environment variable is not configured");
  }

  const upstreamPath = pathSegments.join("/");
  return `${API_URL}/${upstreamPath}${request.nextUrl.search}`;
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
      normalizedKey === "authorization"
    ) {
      return;
    }

    headers.set(key, value);
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const upstreamResponse = await fetch(url, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : Buffer.from(await request.arrayBuffer()),
    cache: "no-store",
  });

  const contentType = upstreamResponse.headers.get("content-type");
  const body = await upstreamResponse.arrayBuffer();
  const response = new NextResponse(body.byteLength ? body : null, {
    status: upstreamResponse.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });

  const shouldPersistSession =
    upstreamResponse.ok &&
    path[0] === "auth" &&
    (path[1] === "login" || path[1] === "register");
  const shouldClearSession =
    upstreamResponse.status === 401 || (path[0] === "auth" && path[1] === "logout");

  if (shouldPersistSession) {
    const payload = body.byteLength
      ? (JSON.parse(Buffer.from(body).toString("utf8")) as {
          accessToken?: string;
          data?: { accessToken?: string };
        })
      : null;
    const accessToken = payload?.data?.accessToken ?? payload?.accessToken;

    if (accessToken) {
      response.cookies.set(TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      response.cookies.set(SESSION_HINT_KEY, "1", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
    }
  }

  if (shouldClearSession) {
    response.cookies.set(TOKEN_KEY, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(SESSION_HINT_KEY, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
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
