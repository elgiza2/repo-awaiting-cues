import { createHmac, webcrypto } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { verifyTelegramInitData } from "./telegram-auth.server";
import { referralId, referralSummarySchema } from "./referrals";

const token = "unit-test-token-not-a-real-credential";
const now = 1800000000;
beforeAll(() => vi.stubGlobal("crypto", webcrypto));
afterAll(() => vi.unstubAllGlobals());
function signed(date = now, userId = 6657246146) {
  const params = new URLSearchParams({ auth_date: String(date), user: JSON.stringify({ id: userId, first_name: "Friend" }), start_param: "r123456" });
  const check = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(token).digest();
  params.set("hash", createHmac("sha256", secret).update(check).digest("hex"));
  return params.toString();
}

describe("Telegram referral ownership", () => {
  it("derives player and inviter only from a verified signature", async () => {
    const verified = await verifyTelegramInitData(signed(), token, now);
    expect(verified.user.id).toBe(6657246146);
    expect(referralId(verified.startParam)).toBe(123456);
  });
  it("rejects a forged player id", async () => {
    const params = new URLSearchParams(signed());
    params.set("user", JSON.stringify({ id: 999999, first_name: "Forged" }));
    await expect(verifyTelegramInitData(params.toString(), token, now)).rejects.toThrow("signature");
  });
  it("rejects a forged referrer", async () => {
    const params = new URLSearchParams(signed());
    params.set("start_param", "r999999");
    await expect(verifyTelegramInitData(params.toString(), token, now)).rejects.toThrow("signature");
  });
  it("rejects old and future launches", async () => {
    await expect(verifyTelegramInitData(signed(now - 3601), token, now)).rejects.toThrow();
    await expect(verifyTelegramInitData(signed(now + 31), token, now)).rejects.toThrow();
  });
  it("rejects missing signatures and duplicate signed fields", async () => {
    await expect(verifyTelegramInitData("user={}", token, now)).rejects.toThrow();
    await expect(verifyTelegramInitData(`${signed()}&start_param=r654321`, token, now)).rejects.toThrow();
  });
  it("rejects unsafe Telegram ids", async () => {
    await expect(verifyTelegramInitData(signed(now, 9007199254740992), token, now)).rejects.toThrow();
    expect(referralId("r9007199254740992")).toBeNull();
  });
  it("keeps pending friends separate from qualified friends", () => {
    const result = referralSummarySchema.parse({ userId: 123456, total: 3, pending: 3, qualified: 0, earnedCoins: 0, awaitingPriceUsd: 0, friends: [] });
    expect(result.qualified).toBe(0);
    expect(result.pending).toBe(3);
  });
});