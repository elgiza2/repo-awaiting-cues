/**
 * The bot's reply to /start, plus the start-param parsing it depends on.
 * Kept as pure data so the wording can be tested without a Telegram call.
 */

import { BOT_URL, COMMUNITY_URL, MINI_APP_URL, inviteLink } from "./bot";
import welcomeAsset from "@/assets/gemston-welcome.png.asset.json";
import rewardsAsset from "@/assets/gemston-rewards.png.asset.json";
import {
  COIN_SYMBOL,
  REFERRAL_USD,
  TASK_USD,
  WELCOME_USD,
  WITHDRAWAL_FEE,
  WITHDRAWAL_REFERRALS,
} from "./mining";

export type BotButton = ({ text: string; web_app: { url: string } } | { text: string; url: string }) & {
  style?: "primary" | "success" | "danger";
  icon_custom_emoji_id?: string;
};
export type BotKeyboard = BotButton[][];

// Verified IDs from Telegram's MajorEmojis sticker set, with native emoji fallbacks.
const major = {
  coin: ["4918300654197277832", "🪙"],
  gift: ["4965219701572503640", "💰"],
  task: ["4924700194123023462", "✔️"],
  friends: ["4976940882071651344", "🤝"],
  launch: ["5145427681680032825", "🚀"],
} as const;
const emoji = (kind: keyof typeof major) => `<tg-emoji emoji-id="${major[kind][0]}">${major[kind][1]}</tg-emoji>`;
export const welcomePhotoUrl = new URL(welcomeAsset.url, MINI_APP_URL).href;
export const withoutCustomEmoji = (text: string) => text.replace(/<tg-emoji emoji-id="\d+">(.*?)<\/tg-emoji>/g, "$1");
export const withoutButtonEmoji = (keyboard: BotKeyboard): BotKeyboard =>
  keyboard.map((row) => row.map(({ icon_custom_emoji_id: _icon, ...button }) => button));

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

export const buildStartMessage = (firstName: string, referrerId: number | null, userId: number | null = null): StartMessage => {
  const name = firstName.trim() ? `, ${escapeHtml(firstName.trim())}` : "";

  const lines = [
    `${emoji("gift")} Welcome to GEMSTON Miner${name}!`,
    "",
    `Your $${WELCOME_USD} welcome gift in ${COIN_SYMBOL} is waiting — claim it in the app.`,
    "",
    `${emoji("coin")} Mine ${COIN_SYMBOL} · one session runs 2 hours`,
    `${emoji("task")} Complete tasks · $${TASK_USD} each`,
    `${emoji("friends")} Invite friends · $${REFERRAL_USD} each`,
    `Withdraw ${COIN_SYMBOL} or GRAM anytime · no minimum. Pay the ${WITHDRAWAL_FEE} GRAM fee first, then invite ${WITHDRAWAL_REFERRALS} friends.`,
    `In-app rewards at live prices. On-chain payouts are not enabled yet.`,
  ];

  if (referrerId != null) {
    lines.push("", `🤝 You joined through a friend's invite — they earn $${REFERRAL_USD} once you're both active.`);
  }

  lines.push("", "Tap Open the app and start mining.");

  return {
    text: `<b>${lines.join("\n")}</b>`,
    keyboard: [
      [{ text: "Open the app", style: "success", icon_custom_emoji_id: major.launch[0], web_app: { url: MINI_APP_URL } }],
      [{ text: "Join the community", style: "primary", icon_custom_emoji_id: major.friends[0], url: COMMUNITY_URL }],
      [{ text: "Invite friends", style: "primary", icon_custom_emoji_id: major.coin[0], url: `https://t.me/share/url?url=${encodeURIComponent(inviteLink(userId))}` }],
    ],
    fallbackKeyboard: [
      [{ text: "🚀 Open the bot", style: "success", url: BOT_URL }],
      [{ text: "🤝 Join the community", style: "primary", url: COMMUNITY_URL }],
      [{ text: "🪙 Invite friends", style: "primary", url: `https://t.me/share/url?url=${encodeURIComponent(inviteLink(userId))}` }],
    ],
  };
};

/** Shown when someone writes anything other than /start. */
export const buildHintMessage = (): { text: string; keyboard: BotKeyboard } => ({
  text: `Send <b>/start</b> to open GEMSTON Miner, or tap the button below.`,
  keyboard: [[{ text: "🚀 Open the app", style: "success", web_app: { url: MINI_APP_URL } }]],
});

export const channelPosts = [
  {
    photo: new URL(welcomeAsset.url, MINI_APP_URL).href,
    caption: `<b>💎 Welcome to GEMSTON!\n\nClaim your $7 welcome gift in GEMSTON and start your first mining session.\n\nMining and rewards are credited in GEMSTON at live STON.fi prices.\n\nOpen the bot: ${BOT_URL}\nCommunity: ${COMMUNITY_URL}\n\nIn-app rewards only for now; on-chain withdrawals are not enabled yet.</b>`,
  },
  {
    photo: new URL(rewardsAsset.url, MINI_APP_URL).href,
    caption: `<b>🚀 Grow your GEMSTON balance\n\n✔️ Complete a task: $3 in GEMSTON\n🤝 Invite a friend: $4 in GEMSTON\n\nCommunity task: ${COMMUNITY_URL}\nTalon task: https://t.me/Talonminibot?startapp=r6657246146\n\nOpen the bot to get your personal invite link.\n${BOT_URL}\n\nRewards use live prices. Task/referral verification and on-chain payouts are not enabled yet.</b>`,
  },
];
