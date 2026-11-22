export const BOT_USERNAME = "Gemystabot";
export const COMMUNITY_URL = "https://t.me/gemstoe";

/**
 * Public address of this build's Mini App. Telegram opens it from the bot's
 * /start message, and BotFather's Main Mini App should point here too.
 */
export const MINI_APP_URL = "https://repo-awaiting-cues.lovable.app";

/** Opens the bot's main Mini App with the inviter's id as start param. */
export const inviteLink = (userId: number | null) =>
  `https://t.me/${BOT_USERNAME}?startapp=${userId != null ? `r${userId}` : "gram"}`;
