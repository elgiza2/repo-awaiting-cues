import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUp, ChevronRight, Gift, UserPlus, Wallet, Zap } from "lucide-react";
import { AppScreen } from "@/components/gram/AppScreen";
import { GramCoin } from "@/components/gram/GramCoin";
import { UserHeader } from "@/components/gram/UserHeader";
import { useMining } from "@/hooks/use-mining";
import { formatUsd, GRAM_SWAP_URL, pricesQuery } from "@/lib/gram-price";
import {
  COIN_SYMBOL,
  DAILY_FREE_CAP,
  nextSessionReward,
  REFERRAL_USD,
  SESSION_MS,
  sessionProgress,
  usdToCoins,
  WELCOME_USD,
} from "@/lib/mining";
import { haptic } from "@/lib/telegram";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEMSTON Miner — Mine, convert to GRAM, withdraw" },
      {
        name: "description",
        content: "Mine GEMSTON on Telegram, convert it to GRAM at live prices and withdraw to your TON wallet.",
      },
      { property: "og:title", content: "GEMSTON Miner — Mine, convert to GRAM, withdraw" },
      { property: "og:description", content: "Mine GEMSTON, convert to GRAM at live prices and withdraw." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
  component: HomePage,
});

function HomePage() {
  const { data: prices } = useSuspenseQuery(pricesQuery);
  const { state, now, ready, start, claim, claimWelcomeGift } = useMining();

  const progress = sessionProgress(state, now);
  const mining = state.sessionStartedAt != null;
  const done = mining && progress >= 1;
  const reward = nextSessionReward(state, now);
  const liveCoins = state.coins + (mining ? reward * progress : 0);
  const usd = prices.coin != null ? liveCoins * prices.coin : null;
  const minedToday =
    state.minedDay === new Date(now || Date.now()).toISOString().slice(0, 10) ? state.minedToday : 0;
  const remainingMs = mining ? Math.max(0, SESSION_MS - (now - (state.sessionStartedAt ?? now))) : 0;
  const welcomeCoins = usdToCoins(WELCOME_USD, prices.coin);

  const onMainButton = () => {
    haptic("medium");
    if (done) claim();
    else if (!mining) start();
  };

  return (
    <AppScreen>
      <UserHeader balance={state.coins} />

      {ready && !state.welcomeClaimed ? (
        <section className="bg-top-glow mt-6 flex items-center gap-4 rounded-2xl border border-gold-border bg-card p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Gift className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Welcome gift · ${WELCOME_USD}</span>
            <span className="block text-sm text-muted-foreground">
              {welcomeCoins > 0 ? `${welcomeCoins.toFixed(2)} ${COIN_SYMBOL}, free on us.` : "Loading price…"}
            </span>
          </span>
          <button
            type="button"
            disabled={welcomeCoins <= 0}
            onClick={() => {
              haptic("heavy");
              claimWelcomeGift(welcomeCoins);
            }}
            className="h-11 shrink-0 rounded-full bg-peach-gradient px-5 font-bold text-primary-foreground shadow-peach transition active:scale-95 disabled:opacity-60"
          >
            Claim
          </button>
        </section>
      ) : (
        <Link
          to="/wallet"
          className="mt-6 flex items-center gap-4 rounded-2xl border border-gold-border bg-card p-4"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Wallet className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Your GEMSTON wallet</span>
            <span className="block text-sm text-muted-foreground">
              Keep {COIN_SYMBOL} or convert to GRAM.
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      )}

      <section className="mt-6 text-center">
        <p className="text-[2.5rem] leading-tight font-extrabold tracking-tight tabular-nums">
          {liveCoins.toLocaleString("en-US", {
            minimumFractionDigits: mining ? 5 : 3,
            maximumFractionDigits: mining ? 5 : 3,
          })}
        </p>
        <p className="text-symbol-gradient text-3xl font-extrabold tracking-tight">{COIN_SYMBOL}</p>
        <p className="mt-2 text-lg font-semibold text-success">
          ≈ {usd != null ? formatUsd(usd) : "$—"} USD
        </p>
        <a
          href={GRAM_SWAP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-success animate-live" />
          <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">1 {COIN_SYMBOL}</span>
          <span className="font-bold text-coral tabular-nums">
            {prices.coin != null ? formatUsd(prices.coin) : "—"}
          </span>
        </a>
      </section>

      <div className="mx-auto mt-6 w-[62%]">
        <GramCoin active={mining && !done} />
      </div>

      <button
        type="button"
        onClick={onMainButton}
        disabled={mining && !done}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-peach-gradient text-lg font-bold text-primary-foreground shadow-peach transition active:scale-[0.98] disabled:opacity-90"
      >
        {done ? (
          <>
            <Gift className="h-5 w-5" /> Claim {reward} {COIN_SYMBOL}
          </>
        ) : mining ? (
          <>
            <Zap className="h-5 w-5 fill-current" /> Mining · {formatRemaining(remainingMs)}
          </>
        ) : reward > 0 ? (
          <>
            <Zap className="h-5 w-5" /> Start mining · {reward} {COIN_SYMBOL}
          </>
        ) : (
          <>Daily limit reached · get a server</>
        )}
      </button>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        One session runs 2h. Start it and come back.
      </p>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-muted-foreground">Mined today</span>
          <span className="tabular-nums text-muted-foreground">
            {minedToday} / {DAILY_FREE_CAP}
          </span>
        </div>
        <Bar value={minedToday / DAILY_FREE_CAP} />
      </section>

      <section className="mt-4 rounded-2xl border border-gold-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <ArrowUp className="h-5 w-5" />
            </span>
            <span className="font-bold">Your withdrawal balance</span>
          </div>
          <span className="text-sm font-bold text-muted-foreground">No minimum</span>
        </div>

        <Row label="GEMSTON balance" value={state.coins.toFixed(3)} />
        <Row label="GRAM balance" value={state.gram.toFixed(3)} />

        <Link
          to="/refer"
          className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background font-semibold"
        >
          <UserPlus className="h-4 w-4" /> Invite a friend
          <span className="font-bold text-accent">+${REFERRAL_USD}</span>
        </Link>
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">Live prices from STON.fi</p>
    </AppScreen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 flex items-center justify-between text-sm font-semibold">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-muted-foreground">{value}</span>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-peach-gradient transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

function formatRemaining(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
