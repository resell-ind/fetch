/** Dependencies */
import { CookieJar } from "./src/core/mod.ts";

/** Types */
import {
  type SessionOpts,

  SessionContext,
} from "./src/types/mod.ts";

export function createSession(options: SessionOpts = { }) {
  const ctx: SessionContext = {
    jar: new CookieJar()
  }

  if(options.proxy)
    ctx.client = Deno.createHttpClient({
      proxy: { url: options.proxy }
    });

  async function fetchWithContext(
    input: RequestInfo,
    init: RequestInit & { client?: Deno.HttpClient, timeout?: number } = { }
  ): Promise<Response> {
    const url = typeof input === "string" ? input : input.url;

    const headers = new Headers({
      ...init.headers,
      ...options.defaultHeaders
    });

    if(ctx.jar.hasCookies(url))
      headers.set("Cookie", ctx.jar.getCookieHeader(url));

    if(ctx.client) init.client = ctx.client;

    const controller = new AbortController();

    const request = new Request(input, {
      ...init,
      headers,
      signal: controller.signal
    });

    try {
      const abortTimeout = setTimeout(
        () => controller.abort(),
        (init.timeout ?? 5 * 1000)
      );

      const response = await fetch(request);
      clearTimeout(abortTimeout);

      if(response.headers.has("Set-Cookie"))
        ctx.jar.setCookies(url, response.headers);

      return response;
    } catch(e) {
      throw e;
    }
  }

  function close() {
    /** Attempt to close the `Deno.HttpClient` */
    ctx.client?.close();

    ctx.jar.clear();
  }

  return {
    fetch: fetchWithContext,
    close,

    clearCookies: () => ctx.jar.clear(),
    getCookieJar: () => ctx.jar
  }
}

export * from "./src/types/mod.ts";