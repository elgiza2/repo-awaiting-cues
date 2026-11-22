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
  SERVERS,
  recordServerPurchase,
  nextSessionReward,
  serverSessionReward,
} from "./mining";
import { PAYMENT_ADDRESS, serverPurchaseTx } from "./payments";

const ready = { balance: 1, feePaid: true, referrals: 3 };

describe("withdrawal rules", () => {
  it("has no minimum and retains the 0.15 GRAM fee and 3 invites", () => {
    expect(MIN_WITHDRAWAL).toBe(0);
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

  it("accepts a purchased server instead of referrals", () => {
    expect(checkWithdrawal({ balance: 0.01, feePaid: true, referrals: 0, purchasedServer: true }).allowed).toBe(true);
    expect(checkWithdrawal({ balance: 0.01, feePaid: true, referrals: 0, purchasedServer: false }).nextStep).toBe("invites");
  });

  it("a purchased server does not replace the 0.15 fee", () => {
    expect(checkWithdrawal({ balance: 1, feePaid: false, referrals: 0, purchasedServer: true }).nextStep).toBe("fee");
  });

  it.each(["GEMSTON", "GRAM"])("allows any positive %s amount after conditions", () => {
    expect(checkWithdrawal({ ...ready, balance: 0.000000001 }).allowed).toBe(true);
    expect(checkWithdrawal({ ...ready, balance: 0.99 }).allowed).toBe(true);
    expect(checkWithdrawal({ ...ready, balance: 0 }).allowed).toBe(false);
    expect(checkWithdrawal({ ...ready, balance: Number.NaN }).allowed).toBe(false);
  });
});

describe("purchased servers", () => {
  it("starts at 1 TON and offers 90 server levels", () => {
    expect(SERVERS).toHaveLength(90);
    expect(SERVERS[0]?.priceTon).toBe(1);
    expect(SERVERS[1]?.priceTon).toBe(2);
  });
  it("adds 0.5 GEMSTON per TON per two-hour session", () => {
    const first = recordServerPurchase(initialMiningState(0), { serverId: "server-1", boc: "wallet-result-1", submittedAt: 0 });
    expect(serverSessionReward(first)).toBe(0.5);
    expect(nextSessionReward(first, 0)).toBe(1);
    const second = recordServerPurchase(initialMiningState(0), { serverId: "server-2", boc: "wallet-result-2", submittedAt: 0 });
    expect(serverSessionReward(second)).toBe(1);
  });
  it("sends exactly 1 TON to the payment address for the first server", () => {
    expect(serverPurchaseTx("server-1").messages).toEqual([{ address: PAYMENT_ADDRESS, amount: "1000000000" }]);
    expect(serverPurchaseTx("server-2").messages[0]?.amount).toBe("2000000000");
    expect(() => serverPurchaseTx("unknown")).toThrow();
  });
  it("does not record cancelled or duplicated purchases", () => {
    const state = initialMiningState(0);
    expect(recordServerPurchase(state, { serverId: "server-1", boc: "", submittedAt: 0 })).toBe(state);
    const purchase = { serverId: "server-1", boc: "wallet-result", submittedAt: 0 };
    const once = recordServerPurchase(state, purchase);
    expect(recordServerPurchase(once, purchase).serverPurchases).toHaveLength(1);
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
