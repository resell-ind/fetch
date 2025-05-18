/** Types */
export type SessionOpts = {
  defaultHeaders?: HeadersInit,
  proxyManager?: IProxyManager
}

export type SessionContext = {
  jar: ICookieJar
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

export interface IProxyManager {
  /** 
   * Returns the next proxy URL or `undefined`
   * if there's no proxies left in the pool
  */
  next(): Promise<string | undefined> | string | undefined;

  /**
   * Optional function that reports when a
   * proxy failed due to a ratelimit or some other
   * third party issue
   */
  fail?(proxy: string, error: Error): void;

  /**
   * Optional function to reset the state (bans, counters)
   */
  reset?(): void;
}

/** External Types */
export type { Cookie } from "@std/http/cookie";