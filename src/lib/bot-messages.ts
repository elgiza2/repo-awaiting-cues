/**
 * The bot's reply to /start, plus the start-param parsing it depends on.
 * Kept as pure data so the wording can be tested without a Telegram call.
 */

import { BOT_USERNAME, COMMUNITY_URL, MINI_APP_URL } from "./bot";
import {
  COIN_SYMBOL,
  MIN_WITHDRAWAL,
  REFERRAL_USD,
  TASK_USD,
  WELCOME_USD,
  WITHDRAWAL_FEE,
  WITHDRAWAL_REFERRALS,
} from "./mining";

export type BotButton = { text: string; web_app: { url: string } } | { text: string; url: string };
export type BotKeyboard = BotButton[][];

export interface StartMessage {
  text: string;
  /** Keyboard with a Mini App button — the one we try first. */
  keyboard: BotKeyboard;
  /** Same keyboard, but the app opens as a plain link if the Mini App button is refused. */
  fallbackKeyboard: BotKeyboard;
}

/** `/start r123` → 123, `/start` or an unknown payload → null. */
export const parseStartParam = (text: string): number | null => {
  const payload = text.trim().split(/\s+/).slice(1).join(" ");
  const match = /^r(\d{3,20})$/.exec(payload);
  return match ? Number(match[1]) : null;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const buildStartMessage = (firstName: string, referrerId: number | null): StartMessage => {
  const name = firstName.trim() ? `, ${escapeHtml(firstName.trim())}` : "";

  const lines = [
    `🎁 Welcome to GEMSTON Miner${name}!`,
    "",
    `Your $${WELCOME_USD} welcome gift in ${COIN_SYMBOL} is waiting — claim it in the app.`,
    "",
    `⛏ Mine ${COIN_SYMBOL} · one session runs 2 hours`,
    `✅ Complete tasks · $${TASK_USD} each`,
    `👥 Invite friends · $${REFERRAL_USD} each`,
    `💎 Withdraw GRAM · pay the ${WITHDRAWAL_FEE} GRAM fee, invite ${WITHDRAWAL_REFERRALS} friends, min ${MIN_WITHDRAWAL} GRAM`,
  ];

  if (referrerId != null) {
    lines.push("", `🤝 You joined through a friend's invite — they earn $${REFERRAL_USD} once you're both active.`);
  }

  lines.push("", "Tap <b>Open the app</b> and start mining.");

  return {
    text: lines.join("\n"),
    keyboard: [
      [{ text: "⛏ Open the app", web_app: { url: MINI_APP_URL } }],
      [{ text: "👥 Join the community", url: COMMUNITY_URL }],
      [{ text: "🔗 Copy my invite link", url: `https://t.me/${BOT_USERNAME}?startapp=gram` }],
    ],
    fallbackKeyboard: [
      [{ text: "⛏ Open the app", url: MINI_APP_URL }],
      [{ text: "👥 Join the community", url: COMMUNITY_URL }],
      [{ text: "🔗 Copy my invite link", url: `https://t.me/${BOT_USERNAME}?startapp=gram` }],
    ],
  };
};

/** Shown when someone writes anything other than /start. */
export const buildHintMessage = (): { text: string; keyboard: BotKeyboard } => ({
  text: `Send <b>/start</b> to open GEMSTON Miner, or tap the button below.`,
  keyboard: [[{ text: "⛏ Open the app", web_app: { url: MINI_APP_URL } }]],
});
