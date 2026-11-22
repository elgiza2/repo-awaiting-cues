export const BOT_USERNAME = "Gemystabot";
export const COMMUNITY_URL = "https://t.me/gemstoe";

/** Opens the bot's main Mini App with the inviter's id as start param. */
export const inviteLink = (userId: number | null) =>
  `https://t.me/${BOT_USERNAME}?startapp=${userId != null ? `r${userId}` : "gram"}`;
