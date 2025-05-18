import { createSession } from "../mod.ts";

const session = createSession({
  proxy: Deno.env.get("PROXY_URL")!
});

const response = await session.fetch("https://example.com");
console.log(response);

session.close();