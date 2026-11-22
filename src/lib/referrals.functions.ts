import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { referralId } from "./referrals";

export const syncReferrals = createServerFn({ method: "POST" })
  .inputValidator(z.object({ initData: z.string().min(1).max(16384) }))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    const token = process.env["TELEGRAM_BOT_TOKEN"];
    if (!token) throw new Error("Telegram is temporarily unavailable.");
    const { verifyTelegramInitData } = await import("./telegram-auth.server");
    const verified = await verifyTelegramInitData(data.initData, token);
    // Admin access is necessary for Telegram-owned rows; ownership comes ONLY from the verified signature.
    const { registerTelegramPlayer, readReferralSummary } = await import("./referrals.server");
    await registerTelegramPlayer(verified.user.id, verified.user.first_name, referralId(verified.startParam));
    const { fetchPrices } = await import("./gram-price");
    const prices = await fetchPrices();
    return readReferralSummary(verified.user.id, prices.coin);
  });