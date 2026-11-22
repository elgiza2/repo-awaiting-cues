import { describe, expect, it } from "vitest";
import {
  checkWithdrawal,
  claimWelcome,
  coinsToGram,
  convertCoins,
  initialMiningState,
  MIN_WITHDRAWAL,
  REFERRAL_USD,
  TASK_USD,
  usdToCoins,
  WELCOME_USD,
  WITHDRAWAL_FEE,
  WITHDRAWAL_REFERRALS,
} from "./mining";

const ready = { balance: 1, feePaid: true, referrals: 3 };

describe("withdrawal rules", () => {
  it("uses a 1 GRAM minimum, 0.15 GRAM fee and 3 invites", () => {
    expect(MIN_WITHDRAWAL).toBe(1);
    expect(WITHDRAWAL_FEE).toBe(0.15);
    expect(WITHDRAWAL_REFERRALS).toBe(3);
  });

  it("asks for the fee first", () => {
    expect(checkWithdrawal({ balance: 0, feePaid: false, referrals: 0 }).nextStep).toBe("fee");
  });

  it("asks for 3 invites after the fee is paid", () => {
    expect(checkWithdrawal({ ...ready, referrals: 2 }).nextStep).toBe("invites");
    expect(checkWithdrawal({ ...ready, referrals: 2 }).allowed).toBe(false);
  });

  it("requires at least 1 GRAM", () => {
    expect(checkWithdrawal({ ...ready, balance: 0.99 }).allowed).toBe(false);
    expect(checkWithdrawal(ready).allowed).toBe(true);
  });
});


describe("rewards", () => {
  it("prices the welcome gift at $7, tasks at $3 and referrals at $4", () => {
    expect(WELCOME_USD).toBe(7);
    expect(TASK_USD).toBe(3);
    expect(REFERRAL_USD).toBe(4);
  });

  it("pays USD rewards in coins at the live price", () => {
    expect(usdToCoins(7, 0.1)).toBe(70);
    expect(usdToCoins(7, null)).toBe(0);
  });

  it("gives the welcome gift only once", () => {
    const once = claimWelcome(initialMiningState(0), 70);
    expect(once.coins).toBe(70);
    expect(claimWelcome(once, 70).coins).toBe(70);
  });
});

describe("conversion to GRAM", () => {
  it("converts coins to GRAM at live prices", () => {
    expect(coinsToGram(100, 0.1, 2)).toBe(5);
    const s = convertCoins({ ...initialMiningState(0), coins: 100 }, 100, 0.1, 2);
    expect(s.coins).toBe(0);
    expect(s.gram).toBe(5);
  });
});
