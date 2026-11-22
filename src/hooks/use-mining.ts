import { useCallback, useEffect, useState } from "react";
import {
  claimSession,
  claimWelcome,
  completeTask,
  convertCoins,
  initialMiningState,
  recordServerPurchase,
  startSession,
  type MiningState,
} from "@/lib/mining";

const KEY = "gemston-game-v1";

const load = (): MiningState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initialMiningState(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return initialMiningState();
};

/** Local game state (read after hydration). */
export const useMining = () => {
  const [state, setState] = useState<MiningState>(() => initialMiningState(0));
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(load());
    setNow(Date.now());
    setReady(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const start = useCallback(() => setState((s) => startSession(s, Date.now())), []);
  const claim = useCallback(() => setState((s) => claimSession(s, Date.now())), []);
  const claimWelcomeGift = useCallback((coins: number) => setState((s) => claimWelcome(s, coins)), []);
  const completeTaskReward = useCallback(
    (taskId: string, coins: number) => setState((s) => completeTask(s, taskId, coins)),
    [],
  );
  const convert = useCallback(
    (amount: number, coinUsd: number | null, gramUsd: number | null) =>
      setState((s) => convertCoins(s, amount, coinUsd, gramUsd)),
    [],
  );
  const markFeePaid = useCallback(() => setState((s) => ({ ...s, feePaid: true })), []);
  const watchAd = useCallback(() => setState((s) => ({ ...s, adsWatched: s.adsWatched + 1 })), []);
  const recordPurchase = useCallback((serverId: string, boc: string) => setState((s) => recordServerPurchase(s, { serverId, boc, submittedAt: Date.now() })), []);

  return { state, now, ready, start, claim, claimWelcomeGift, completeTaskReward, convert, markFeePaid, recordPurchase, watchAd };
};
