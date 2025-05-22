/** Types */
export type SessionOpts = {
  defaultHeaders?: HeadersInit,
  proxy?: string
}

export type SessionContext = {
  jar: ICookieJar,
  client?: Deno.HttpClient
}

/** Interfaces */
export interface ICookieJar {
  /**
   * Attempts to parse cookies from the `Set-Cookie`
   * response header for the given URL
   */
  setCookies(url: string, headers: Headers): void;

  /*
   * Get the `cookie` header string for a specific URL
   * Returns a string in the format: `cookie_one=value; cookie_two=value`
   */
  getCookieHeader(url: string): string;

  /**
   * Checks whether or not the jar has
   * cookies for a specific URL
   */
  hasCookies(url: string): boolean;

  /**
   * Clears all stored cookies
   */
  clear(): void;
}

/** External Types */
export type { Cookie } from "jsr:@std/http/cookie";