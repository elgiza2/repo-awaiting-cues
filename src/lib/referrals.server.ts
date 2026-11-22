import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { referralSummarySchema } from "./referrals";

/** Called only after a signed Mini App launch or an authenticated private bot update. */
export async function registerTelegramPlayer(id: number, name: string, referrer: number | null) {
  const { error } = await supabaseAdmin.rpc("gemston_register", { p_id: id, p_first: name, ...(referrer !== null ? { p_referrer: referrer } : {}) });
  if (error) {
    console.error("Referral registration failed", error.code);
    throw new Error("Could not save your Telegram account. Please try again.");
  }
}

export async function readReferralSummary(id: number, coinPrice: number | null) {
  const { data, error } = await supabaseAdmin.rpc("gemston_referral_summary", { p_id: id, ...(coinPrice ? { p_coin_price: coinPrice } : {}) });
  if (error) {
    console.error("Referral summary failed", error.code);
    throw new Error("Could not load your invites. Please try again.");
  }
  return referralSummarySchema.parse(data);
}