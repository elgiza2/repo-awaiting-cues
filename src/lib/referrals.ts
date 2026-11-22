import { z } from "zod";

export const referralSummarySchema = z.object({
  userId: z.number().int().positive().safe(),
  total: z.number().int().nonnegative(),
  qualified: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  earnedCoins: z.number().nonnegative(),
  awaitingPriceUsd: z.number().nonnegative(),
  friends: z.array(z.object({ name: z.string(), joinedAt: z.string(), qualified: z.boolean() })),
});
export type ReferralSummary = z.infer<typeof referralSummarySchema>;

export function referralId(payload: string | undefined): number | null {
  if (!payload || !/^r\d{3,16}$/.test(payload)) return null;
  const id = Number(payload.slice(1));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}