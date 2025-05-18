/** Dependencies */
import { CookieJar } from "@src/core";

/** Types */
import {
  type SessionOpts,

  SessionContext,
} from "@src/types";

export function createSession(options: SessionOpts = { }) {
  const ctx: SessionContext = {
    jar: new CookieJar()
  }

  async function fetchWithContext(
    input: RequestInfo,
    init: RequestInit = { }
  ): Promise<Response> {
    const url = typeof input === "string" ? input : input.url;

    const headers = new Headers({
      ...init.headers,
      ...options.defaultHeaders
    });

    if(ctx.jar.hasCookies(url))
      headers.set("Cookie", ctx.jar.getCookieHeader(url));

    /** @TODO Add proxy implementation */

    const controller = new AbortController();

    const request = new Request(input, {
      ...init,
      headers,
      signal: controller.signal
    });

    try {
      /** @TODO Optional timeout per request */
      const abortTimeout = setTimeout(() => controller.abort(), 5 * 1000);

      const response = await fetch(request);
      clearTimeout(abortTimeout);

      if(response.headers.has("Set-Cookie"))
        ctx.jar.setCookies(url, response.headers);

      return response;
    } catch(e) {
      throw e;
    }
  }

  return {
    fetch: fetchWithContext,

    clearCookies: () => ctx.jar.clear(),
    getCookieJar: () => ctx.jar,

    setProxyManager: (manager: typeof options.proxyManager) =>
      (options.proxyManager = manager)
  }
}

export * from "@src/types";