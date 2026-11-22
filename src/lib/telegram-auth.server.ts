import { z } from "zod";

const userSchema = z.object({
  id: z.number().int().positive().safe(),
  first_name: z.string().max(256),
  is_bot: z.literal(false).optional(),
});
const encoder = new TextEncoder();

async function hmac(key: Uint8Array, value: string): Promise<Uint8Array> {
  const imported = await crypto.subtle.importKey("raw", Uint8Array.from(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", imported, encoder.encode(value)));
}

/** Only a signed, recent Telegram launch can authorize a player's private data. */
export async function verifyTelegramInitData(raw: string, token: string, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!raw || raw.length > 16384) throw new Error("Open the app again from Telegram.");
  const params = new URLSearchParams(raw);
  const seen = new Set<string>();
  for (const key of params.keys()) {
    if (seen.has(key)) throw new Error("Invalid Telegram launch.");
    seen.add(key);
  }
  const hash = params.get("hash") ?? "";
  if (!/^[a-f0-9]{64}$/i.test(hash)) throw new Error("Invalid Telegram signature.");
  params.delete("hash");
  const check = Array.from(params.entries()).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => `${key}=${value}`).join("\n");
  const secret = await hmac(encoder.encode("WebAppData"), token);
  const actual = await hmac(secret, check);
  const expected = new Uint8Array(hash.match(/../g)?.map((pair) => parseInt(pair, 16)) ?? []);
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= (actual[i] ?? 0) ^ (expected[i] ?? 0);
  if (diff !== 0) throw new Error("Invalid Telegram signature.");
  const authDate = Number(params.get("auth_date"));
  if (!Number.isSafeInteger(authDate) || authDate <= 0 || nowSeconds - authDate > 3600 || authDate > nowSeconds + 30) {
    throw new Error("Open the app again from Telegram.");
  }
  const user = userSchema.parse(JSON.parse(params.get("user") ?? "null"));
  return { user, startParam: params.get("start_param") ?? undefined };
}