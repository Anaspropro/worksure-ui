import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./generated/schema";
import { clearSessionHint } from "../api-client";

const INTERNAL_API_PREFIX = "/api/proxy";

export const apiClient = createClient<paths>({
  baseUrl: INTERNAL_API_PREFIX,
});

// We can add a middleware to handle 401s if we want to mimic current behavior
const authMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.status === 401) {
      clearSessionHint();
    }
    return response;
  }
};

apiClient.use(authMiddleware);

export default apiClient;
