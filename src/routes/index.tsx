import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Cpu, Gift, Layers3, Wallet, Zap } from "lucide-react";
import { AppScreen } from "@/components/gram/AppScreen";
import { DataSlabs } from "@/components/gram/DataSlabs";
import { UserHeader } from "@/components/gram/UserHeader";
import { Button } from "@/components/ui/button";
import { useMining } from "@/hooks/use-mining";
import { formatUsd, GRAM_SWAP_URL, pricesQuery } from "@/lib/gram-price";
import { COIN_SYMBOL, dailyMiningCap, nextSessionReward, REFERRAL_USD, SESSION_MS, sessionProgress, usdToCoins, WELCOME_USD } from "@/lib/mining";
import { haptic } from "@/lib/telegram";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "GEMSTON — Your mining overview" },
    { name: "description", content: "Your GEMSTON mining overview. Collect your welcome gift, mine, explore servers and manage your TON wallet." },
    { property: "og:title", content: "GEMSTON — Your mining overview" },
    { property: "og:description", content: "Mine GEMSTON, collect rewards and manage your wallet at live market prices." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
  const minedToday = state.minedDay === new Date(now || Date.now()).toISOString().slice(0, 10) ? state.minedToday : 0;
  const remainingMs = mining ? Math.max(0, SESSION_MS - (now - (state.sessionStartedAt ?? now))) : 0;
  const welcomeCoins = usdToCoins(WELCOME_USD, prices.coin);
  const dailyCap = dailyMiningCap(state);
  const onMainButton = () => { haptic("medium"); if (done) claim(); else if (!mining) start(); };

  return <AppScreen home>
    <UserHeader balance={state.coins} />
    <section className="hero-layout">
      <div className="hero-copy">
        <p className="balance-label" data-enter>Your balance</p>
        <h1 className="mining-balance" data-enter>{liveCoins.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: mining ? 5 : 3 })}<span>{COIN_SYMBOL}</span></h1>
        <p className="balance-usd" data-enter>≈ {usd != null ? formatUsd(usd) : "$—"}</p>
        <a className="hero-eyebrow" href={GRAM_SWAP_URL} target="_blank" rel="noreferrer" data-enter><i className="animate-live" /> 1 {COIN_SYMBOL} = {prices.coin != null ? formatUsd(prices.coin) : "$—"}<ArrowUpRight className="h-3 w-3" /></a>
        <div className="hero-actions" data-enter>
          <Button onClick={onMainButton} disabled={mining && !done}>
            {done ? <Gift /> : <Zap />}
            {done ? `Claim ${reward} ${COIN_SYMBOL}` : mining ? `Mining · ${formatRemaining(remainingMs)}` : reward > 0 ? "Start mining" : "Daily limit reached"}
          </Button>
          <Button asChild variant="outline"><Link to="/servers">Servers <ArrowUpRight /></Link></Button>
        </div>
        <div className="mining-status" data-enter><span>{mining ? "SESSION PROGRESS" : "MINED TODAY"}</span><span>{mining ? `${Math.floor(progress * 100)}% · 2h session` : `${minedToday} / ${dailyCap} ${COIN_SYMBOL}`}</span></div>
        <div className="mining-track"><div style={{ width: `${Math.min(100, Math.max(0, (mining ? progress : minedToday / dailyCap) * 100))}%` }} /></div>
        <div className="hero-stats">
          <div className="hero-stat" data-enter><strong>{reward}</strong><span>GEMSTON / 2h</span></div>
          <div className="hero-stat" data-enter><strong>{minedToday}</strong><span>Mined today</span></div>
          <div className="hero-stat" data-enter><strong>{state.serverPurchases.length.toString().padStart(2, "0")}</strong><span>Servers</span></div>
        </div>
      </div>
      <div className="hero-artwork">
        <DataSlabs className="hero-slabs" />
        <article className="float-card float-card-first" data-enter>
          <span className="float-icon"><Gift className="h-5 w-5" /></span>
          <div><p className="float-kicker">Welcome gift</p><h2 className="float-title">${WELCOME_USD} in GEMSTON</h2>
            {ready && !state.welcomeClaimed ? <Button variant="link" className="h-auto p-0 mt-2 text-xs text-accent" disabled={welcomeCoins <= 0} onClick={() => { haptic("heavy"); claimWelcomeGift(welcomeCoins); }}>Claim gift <ArrowUpRight /></Button> : <Link to="/wallet">Your wallet <ArrowUpRight className="h-3 w-3" /></Link>}
          </div>
        </article>
        <article className="float-card float-card-second" data-enter>
          <span className="float-icon"><Layers3 className="h-5 w-5" /></span>
          <div><p className="float-kicker">Servers</p><h2 className="float-title">From 1 TON</h2><Link to="/servers">Buy a server <ArrowUpRight className="h-3 w-3" /></Link></div>
        </article>
      </div>
    </section>
    <section className="home-overview" data-enter>
      <div className="overview-item"><Wallet /><div><p>GRAM</p><strong>{state.gram.toFixed(3)}</strong></div></div>
      <div className="overview-item"><Gift /><div><p>REFERRALS</p><strong><Link to="/refer">Invite · +${REFERRAL_USD} <ArrowUpRight className="inline h-3 w-3" /></Link></strong></div></div>
      <div className="overview-item"><Cpu /><div><p>MINING</p><strong>2h sessions</strong></div></div>
    </section>
  </AppScreen>;
}
function formatRemaining(ms: number) {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 3600)}:${String(Math.floor((total % 3600) / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
