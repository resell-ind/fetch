/** Dependencies */
import { getSetCookies } from "../../deps.ts";

/** Types */
import {
  type Cookie,

  ICookieJar
} from "../types/mod.ts";

export class CookieJar implements ICookieJar {
  private cookies = new Map<string, Cookie[]>();

  public setCookies(url: string, headers: Headers): void {
    const domain = this.getDomain(url);

    if(!domain)
      return;

    if(!this.cookies.has(domain))
      this.cookies.set(domain, [ ]);

    const cookies = this.cookies.get(domain)!;
  
    for(const cookie of getSetCookies(headers)) {
      const idx = cookies.findIndex(
        (c: Cookie) => c.name === cookie.name
      );

      if(idx === -1) {
        cookies.push(cookie);

        continue;
      }

      cookies[idx] = cookie;
    }
  }

  public getCookieHeader(url: string): string {
    const domain = this.getDomain(url);

    if(!domain)
      return "";

    const cookies = (this.cookies.get(domain) ?? [ ]).filter((cookie: Cookie) => {
      if(cookie.expires && new Date() > cookie.expires) return false;
      
      return true;
    });

    return cookies.map((cookie: Cookie) => `${cookie.name}=${cookie.value}`).join("; ");
  }

  public clear(): void {
    this.cookies.clear();
  }

  public hasCookies(url: string): boolean {
    const domain = this.getDomain(url);

    return domain ? this.cookies.has(domain) : false;
  }

  private getDomain(url: string): string | null {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  }
}
