export const BOT_USERNAME = "Gemystabot";
export const BOT_URL = `https://t.me/${BOT_USERNAME}`;
export const COMMUNITY_URL = "https://t.me/gemstoe";

/**
 * Public address of this build's Mini App. Telegram opens it from the bot's
 * /start message, and BotFather's Main Mini App should point here too.
 */
export const MINI_APP_URL = "https://repo-awaiting-cues.lovable.app";

/** Opens the bot chat with the inviter's referral code for /start. */
export const inviteLink = (userId: number | null) =>
  `${BOT_URL}?start=${userId != null ? `r${userId}` : "gram"}`;
