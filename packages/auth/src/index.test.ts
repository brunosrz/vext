import { MemoryAuthProvider } from "./index.js";

const provider = new MemoryAuthProvider();
const token = await provider.authorize(["b", "a", "a"]);
if (token.scopes.join() !== "a,b")
  throw new Error("scopes must be unique and sorted");
if (!provider.isValid(token, ["a"])) throw new Error("issued token rejected");
if (provider.isValid(token, ["c"])) throw new Error("missing scope accepted");

const other = await provider.authorize(["a"]);
await provider.revoke(token);
if (provider.isValid(token)) throw new Error("revoked token still valid");
if (!provider.isValid(other))
  throw new Error("revoking one token revoked another");

if (provider.isValid({ ...token, provider: "other" }))
  throw new Error("token from another provider accepted");
const expired = new MemoryAuthProvider("memory", -1);
if (expired.isValid(await expired.authorize([])))
  throw new Error("expired token accepted");
