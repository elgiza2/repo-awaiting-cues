/**
 * Telegram webhook: answers /start with the welcome message and an app button.
 *
 * Public by placement (`/api/public/*`), so the caller is verified here with the
 * secret token Telegram sends back on every delivery.
 */

import { createFileRoute } from "@tanstack/react-router";
import { buildHintMessage, buildStartMessage, parseStartParam } from "@/lib/bot-messages";

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
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; description?: string };
  if (!response.ok || data.ok === false) {
    throw new Error(`Telegram ${method} failed [${response.status}]: ${data.description ?? "no body"}`);
  }
}

async function sendWelcome(token: string, chatId: number, firstName: string, referrerId: number | null) {
  const message = buildStartMessage(firstName, referrerId);
  const base = { chat_id: chatId, text: message.text, parse_mode: "HTML", disable_web_page_preview: true };

  try {
    await callTelegram(token, "sendMessage", { ...base, reply_markup: { inline_keyboard: message.keyboard } });
  } catch (error) {
    console.error(`${String(error)} — retrying with a plain link button`);
    await callTelegram(token, "sendMessage", {
      ...base,
      reply_markup: { inline_keyboard: message.fallbackKeyboard },
    });
  }
}

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

        const update = (await request.json().catch(() => null)) as {
          callback_query?: { id?: string };
          message?: {
            chat?: { id?: number };
            from?: { first_name?: string };
            text?: string;
          };
          edited_message?: {
            chat?: { id?: number };
            from?: { first_name?: string };
            text?: string;
          };
        } | null;

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

        if (/^\/(start|help)\b/i.test(text)) {
          await sendWelcome(token, chatId, firstName, parseStartParam(text));
          return Response.json({ ok: true });
        }

        const hint = buildHintMessage();
        await callTelegram(token, "sendMessage", {
          chat_id: chatId,
          text: hint.text,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: hint.keyboard },
        });
        return Response.json({ ok: true });
      },
    },
  },
});
