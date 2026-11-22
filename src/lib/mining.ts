/**
 * Core game economy. Players earn the in-game COIN (mining, tasks, referrals, gifts),
 * convert it to GRAM at live market prices, then withdraw GRAM. Pure functions so they can be tested.
 */

export const COIN_SYMBOL = "GEMSTON";

export const SESSION_MS = 2 * 60 * 60 * 1000; // one mining session = 2h
export const FREE_SESSION_REWARD = 0.5; // COIN per free session (no server)
export const DAILY_FREE_CAP = 2.5; // COIN per day without servers

// Rewards are priced in USD and paid in COIN at the live price.
export const WELCOME_USD = 7;
export const TASK_USD = 3;
export const REFERRAL_USD = 4;

export const MIN_WITHDRAWAL = 0; // No minimum for either GEMSTON or GRAM; a positive balance is required.
export const WITHDRAWAL_FEE = 0.15; // GRAM, paid by the user first
export const WITHDRAWAL_REFERRALS = 3; // friends to invite after paying the fee
export const SERVER_COUNT = 90;
export const SERVER_START_TON = 1;
export const SERVER_REWARD_PER_TON = 0.5;
export const SERVERS = Array.from({ length: SERVER_COUNT }, (_, index) => ({
  id: `server-${index + 1}`,
  name: `GEM Rig ${String(index + 1).padStart(2, "0")}`,
  priceTon: SERVER_START_TON + index,
  imageIndex: index % 9,
  sessionReward: (SERVER_START_TON + index) * SERVER_REWARD_PER_TON,
}));
export interface ServerPurchase { serverId: string; submittedAt: number; boc: string }

export interface MiningState {
  coins: number; // in-game COIN balance
  gram: number; // converted GRAM balance (withdrawable)
  sessionStartedAt: number | null;
  minedToday: number;
  minedDay: string; // YYYY-MM-DD the minedToday counter belongs to
  referrals: number;
  adsWatched: number;
  completedTasks: string[];
  welcomeClaimed: boolean;
  feePaid: boolean;
  serverPurchases: ServerPurchase[]; // Local wallet submissions, NOT chain-verified payout entitlements.
}

export const initialMiningState = (now = Date.now()): MiningState => ({
  coins: 0,
  gram: 0,
  sessionStartedAt: null,
  minedToday: 0,
  minedDay: dayKey(now),
  referrals: 0,
  adsWatched: 0,
  completedTasks: [],
  welcomeClaimed: false,
  feePaid: false,
  serverPurchases: [],
});

export const dayKey = (now: number) => new Date(now).toISOString().slice(0, 10);

/** USD value → COIN amount at the live COIN price (4 decimals). */
export const usdToCoins = (usd: number, coinUsd: number | null) =>
  coinUsd && coinUsd > 0 ? Math.floor((usd / coinUsd) * 1e4) / 1e4 : 0;

/** COIN → GRAM at live prices of both. */
export const coinsToGram = (coins: number, coinUsd: number | null, gramUsd: number | null) =>
  coinUsd && gramUsd && coinUsd > 0 && gramUsd > 0 ? Math.floor(((coins * coinUsd) / gramUsd) * 1e6) / 1e6 : 0;

/** Reward available for the next session, limited by what's left of today's cap. */
export const nextSessionReward = (state: MiningState, now = Date.now()) => {
  const today = state.minedDay === dayKey(now) ? state.minedToday : 0;
  const boost = serverSessionReward(state);
  return Math.max(0, Math.min(FREE_SESSION_REWARD + boost, DAILY_FREE_CAP + boost * 12 - today));
};

export const serverSessionReward = (state: MiningState) =>
  state.serverPurchases.reduce((total, purchase) => total + (SERVERS.find((s) => s.id === purchase.serverId)?.sessionReward ?? 0), 0);
export const dailyMiningCap = (state: MiningState) => DAILY_FREE_CAP + serverSessionReward(state) * 12;
export const recordServerPurchase = (state: MiningState, purchase: ServerPurchase): MiningState => {
  if (!SERVERS.some((s) => s.id === purchase.serverId) || !purchase.boc || state.serverPurchases.some((p) => p.serverId === purchase.serverId || p.boc === purchase.boc)) return state;
  return { ...state, serverPurchases: [...state.serverPurchases, purchase] };
};

export const sessionProgress = (state: MiningState, now = Date.now()) => {
  if (state.sessionStartedAt == null) return 0;
  return Math.min(1, Math.max(0, (now - state.sessionStartedAt) / SESSION_MS));
};

export const startSession = (state: MiningState, now = Date.now()): MiningState => {
  if (state.sessionStartedAt != null || nextSessionReward(state, now) <= 0) return state;
  return { ...state, sessionStartedAt: now };
};

export const claimSession = (state: MiningState, now = Date.now()): MiningState => {
  if (state.sessionStartedAt == null || sessionProgress(state, now) < 1) return state;
  const sameDay = state.minedDay === dayKey(now);
  const reward = nextSessionReward(state, now);
  return {
    ...state,
    coins: round(state.coins + reward),
    sessionStartedAt: null,
    minedToday: round((sameDay ? state.minedToday : 0) + reward),
    minedDay: dayKey(now),
  };
};

export const claimWelcome = (state: MiningState, coins: number): MiningState =>
  state.welcomeClaimed || coins <= 0
    ? state
    : { ...state, welcomeClaimed: true, coins: round(state.coins + coins) };

export const completeTask = (state: MiningState, taskId: string, coins: number): MiningState => {
  if (state.completedTasks.includes(taskId) || coins <= 0) return state;
  return {
    ...state,
    coins: round(state.coins + coins),
    completedTasks: [...state.completedTasks, taskId],
  };
};

/** Converts `amount` COIN into GRAM at the given prices. */
export const convertCoins = (
  state: MiningState,
  amount: number,
  coinUsd: number | null,
  gramUsd: number | null,
): MiningState => {
  const coins = Math.min(amount, state.coins);
  const gram = coinsToGram(coins, coinUsd, gramUsd);
  if (coins <= 0 || gram <= 0) return state;
  return { ...state, coins: round(state.coins - coins), gram: round(state.gram + gram) };
};

export type WithdrawalStep = "fee" | "invites" | "balance" | "ready";

export interface WithdrawalCheck {
  balanceOk: boolean;
  feePaid: boolean;
  invitesOk: boolean;
  /** Pay first, invite friends next; a positive balance is required, with no minimum or time window. */
  nextStep: WithdrawalStep;
  allowed: boolean;
}

export const checkWithdrawal = (input: {
  balance: number; // Selected currency amount, GEMSTON or GRAM
  feePaid: boolean;
  referrals: number;
  purchasedServer?: boolean;
}): WithdrawalCheck => {
  const balanceOk = Number.isFinite(input.balance) && input.balance > MIN_WITHDRAWAL;
  const invitesOk = input.referrals >= WITHDRAWAL_REFERRALS || input.purchasedServer === true;
  const nextStep: WithdrawalStep = !input.feePaid
    ? "fee"
    : !invitesOk
      ? "invites"
      : !balanceOk
        ? "balance"
        : "ready";
  return { balanceOk, feePaid: input.feePaid, invitesOk, nextStep, allowed: nextStep === "ready" };
};

const round = (n: number) => Math.round(n * 1e9) / 1e9;
