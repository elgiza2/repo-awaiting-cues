import { describe, expect, it } from "vitest";
import { buildHintMessage, buildStartMessage, parseStartParam } from "./bot-messages";
import {
  REFERRAL_USD,
  TASK_USD,
  WELCOME_USD,
  WITHDRAWAL_FEE,
  WITHDRAWAL_REFERRALS,
} from "./mining";

describe("start message", () => {
  it("names the $7 welcome gift, the $3 task and the $4 referral", () => {
    const { text } = buildStartMessage("Omar", null);
    expect(text).toContain(`$${WELCOME_USD} welcome gift`);
    expect(text).toContain(`$${TASK_USD} each`);
    expect(text).toContain(`$${REFERRAL_USD} each`);
  });

  it("states the withdrawal terms: fee and 3 invites", () => {
    const { text } = buildStartMessage("Omar", null);
    expect(text).toContain(`${WITHDRAWAL_FEE} GRAM fee`);
    expect(text).toContain(`invite ${WITHDRAWAL_REFERRALS} friends`);
  });

  it("greets the user by name and escapes markup", () => {
    expect(buildStartMessage("<b>Omar</b>", null).text).toContain("&lt;b&gt;Omar&lt;/b&gt;");
    expect(buildStartMessage("   ", null).text).not.toContain("GEMSTON Miner,");
  });

  it("mentions the inviter only when the start payload carries one", () => {
    expect(buildStartMessage("Omar", 42).text).toContain("friend's invite");
    expect(buildStartMessage("Omar", null).text).not.toContain("friend's invite");
  });

  it("offers a Mini App button that opens the app", () => {
    const { keyboard } = buildStartMessage("Omar", null);
    expect(keyboard[0]?.[0]).toMatchObject({ web_app: { url: expect.stringMatching(/^https:\/\//) } });
  });

  it("has a plain-link fallback if the Mini App button is refused", () => {
    const { fallbackKeyboard } = buildStartMessage("Omar", null);
    expect(fallbackKeyboard[0]?.[0]).toMatchObject({ url: expect.stringMatching(/^https:\/\//) });
  });

  it("keeps the fallback hint short", () => {
    expect(buildHintMessage().text).toContain("/start");
  });
});

describe("start payload", () => {
  it("reads the inviter id from /start r<id>", () => {
    expect(parseStartParam("/start r6657246146")).toBe(6657246146);
  });

  it("ignores plain /start and anything that is not an invite code", () => {
    expect(parseStartParam("/start")).toBeNull();
    expect(parseStartParam("/start gram")).toBeNull();
    expect(parseStartParam("/start rabc")).toBeNull();
    expect(parseStartParam("hello")).toBeNull();
  });
});
