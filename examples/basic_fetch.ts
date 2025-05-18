import { createSession } from "../mod.ts";

const session = createSession();

const reponse = await session.fetch("https://example.com");
console.log(reponse);

session.close();