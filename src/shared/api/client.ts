import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./generated/schema";
import { clearSessionHint } from "./fetcher";

const INTERNAL_API_PREFIX = "/api/proxy";

function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : undefined;
}

export const apiClient = createClient<paths>({
  baseUrl: INTERNAL_API_PREFIX,
  fetch: (request: Request) => {
    return fetch(request, { cache: "no-store", credentials: "same-origin" } as RequestInit);
  },
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // If client-side and an auth_token cookie exists, set Authorization header if not already set
    const token = getClientCookie("auth_token");
    if (token && !request.headers.get("Authorization")) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401 && response.url.includes("/auth/me")) {
      clearSessionHint();
    }
    return response;
  },
};

apiClient.use(authMiddleware);

export default apiClient;
