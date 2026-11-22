import { describe, expect, it } from "vitest";
import { BOT_URL, inviteLink } from "./bot";
import { buildStartMessage, channelPosts } from "./bot-messages";

describe("Telegram invitation destinations", () => {
  it("uses the bot and preserves the inviter's Telegram id", () => {
    expect(inviteLink(6657246146)).toBe("https://t.me/Gemystabot?start=r6657246146");
    expect(inviteLink(null)).toBe("https://t.me/Gemystabot?start=gram");
  });
  it("shares the current user's bot invitation in both keyboard variants", () => {
    const message = buildStartMessage("Omar", 999, 6657246146);
    for (const keyboard of [message.keyboard, message.fallbackKeyboard]) {
      const button = keyboard[2]?.[0];
      if (!button || !("url" in button)) throw new Error("Invite button missing");
      expect(new URL(button.url).searchParams.get("url")).toBe("https://t.me/Gemystabot?start=r6657246146");
    }
  });
  it("keeps the fallback destination in Telegram", () => {
    expect(buildStartMessage("Omar", null).fallbackKeyboard[0]?.[0]).toMatchObject({ url: BOT_URL });
  });
  it("all public post URLs stay in Telegram", () => {
    for (const post of channelPosts) {
      const urls = post.caption.match(/https:\/\/[^\s<]+/g) ?? [];
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) expect(new URL(url).hostname).toBe("t.me");
    }
  });
});