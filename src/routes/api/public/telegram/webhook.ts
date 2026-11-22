/**
 * Telegram webhook: answers /start with the welcome message and an app button.
 *
 * Public by placement (`/api/public/*`), so the caller is verified here with the
 * secret token Telegram sends back on every delivery.
 */

import { createFileRoute } from "@tanstack/react-router";
import { buildHintMessage, buildStartMessage, channelPosts, parseStartParam, welcomePhotoUrl, withoutCustomEmoji } from "@/lib/bot-messages";
import { z } from "zod";

const TELEGRAM_API = "https://api.telegram.org";

/** Same derivation the sandbox `setWebhook` call uses, so both sides agree. */
async function webhookSecret(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`telegram-webhook:${token}`));
  const binary = Array.from(new Uint8Array(digest), (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function callTelegram(token: string, method: string, payload: Record<string, unknown>) {
  const response = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  const data = JSON.parse(body) as { ok?: boolean; description?: string };
  if (!response.ok || data.ok === false) {
    throw new Error(`Telegram ${method} failed [${response.status}]: ${data.description ?? body}`);
  }
}

async function sendWelcome(token: string, chatId: number, firstName: string, referrerId: number | null, userId: number | null) {
  const message = buildStartMessage(firstName, referrerId, userId);
  const base = { chat_id: chatId, photo: welcomePhotoUrl, caption: message.text, parse_mode: "HTML" };

  try {
    await callTelegram(token, "sendPhoto", { ...base, reply_markup: { inline_keyboard: message.keyboard } });
  } catch (error) {
    if (!String(error).includes("[400]")) throw error;
    console.error(`${String(error)} — retrying without custom emoji or web app buttons`);
    await callTelegram(token, "sendPhoto", {
      ...base,
      caption: withoutCustomEmoji(message.text),
      reply_markup: { inline_keyboard: message.fallbackKeyboard },
    });
  }
}

const telegramMessage = z.object({
  chat: z.object({ id: z.number().int(), type: z.string().optional() }),
  from: z.object({ id: z.number().int().positive().optional(), first_name: z.string().max(256).optional(), username: z.string().max(64).optional() }).optional(),
  text: z.string().max(4096).optional(),
});
const updateSchema = z.object({
  message: telegramMessage.optional(),
  edited_message: telegramMessage.optional(),
  callback_query: z.object({ id: z.string().max(256) }).optional(),
});

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env["TELEGRAM_BOT_TOKEN"];
        if (!token) {
          console.error("TELEGRAM_BOT_TOKEN is not configured");
          return new Response("Bot token missing", { status: 500 });
        }

        const expected = await webhookSecret(token);
        const received = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(received, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const parsed = updateSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Invalid update", { status: 400 });
        const update = parsed.data;

        if (update?.callback_query?.id) {
          await callTelegram(token, "answerCallbackQuery", {
            callback_query_id: update.callback_query.id,
            text: "Open the app to keep mining ⛏",
          });
          return Response.json({ ok: true });
        }

        const message = update?.message ?? update?.edited_message;
        const chatId = message?.chat?.id;
        if (typeof chatId !== "number") return Response.json({ ok: true, ignored: true });

        const text = (message?.text ?? "").trim();
        const firstName = message?.from?.first_name ?? "";

        // Only authenticated private /start updates bind invitations. Repeated deliveries cannot rebind a player.
        if (message?.chat.type === "private" && message.from?.id === chatId && /^\/start(?:@\w+)?(?:\s|$)/i.test(text)) {
          try {
            const { registerTelegramPlayer } = await import("@/lib/referrals.server");
            await registerTelegramPlayer(chatId, firstName, parseStartParam(text));
          } catch {
            // Non-2xx makes Telegram retry instead of silently losing the invitation.
            return Response.json({ ok: false, error: "Could not register invitation" }, { status: 503 });
          }
        }

        if (/^\/(start|help)\b/i.test(text)) {
          try {
            await sendWelcome(token, chatId, firstName, parseStartParam(text), message?.from?.id ?? null);
            // Public channel drafts are only sent to the recipient requested by the owner.
            if (message?.chat.type === "private" && message.from?.username?.toLowerCase() === "torekr") {
              for (const post of channelPosts) {
                await callTelegram(token, "sendPhoto", { chat_id: chatId, ...post, parse_mode: "HTML" });
              }
            }
          } catch (error) {
            console.error(String(error));
            return Response.json({ ok: true, delivered: false });
          }
          return Response.json({ ok: true });
        }

        const hint = buildHintMessage();
        try {
          await callTelegram(token, "sendMessage", {
            chat_id: chatId,
            text: hint.text,
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: hint.keyboard },
          });
        } catch (error) {
          console.error(String(error));
          return Response.json({ ok: true, delivered: false });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
