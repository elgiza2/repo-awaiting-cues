import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Copy, Gift, Share, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AppScreen } from "@/components/gram/AppScreen";
import { GramMark } from "@/components/gram/GramMark";
import { UserHeader } from "@/components/gram/UserHeader";
import { useMining } from "@/hooks/use-mining";
import { useReferrals } from "@/hooks/use-referrals";
import { BOT_URL, inviteLink } from "@/lib/bot";
import { pricesQuery } from "@/lib/gram-price";
import { COIN_SYMBOL, REFERRAL_USD, usdToCoins } from "@/lib/mining";
import { haptic, openTelegramLink } from "@/lib/telegram";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Invite friends — GEMSTON Miner" },
      { name: "description", content: "Share your GEMSTON Miner invite link and view referral rewards." },
      { property: "og:title", content: "Invite friends — GEMSTON Miner" },
      { property: "og:description", content: "Share your GEMSTON Miner invite link and view referral rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
  component: ReferPage,
});

function ReferPage() {
  const { data: prices } = useSuspenseQuery(pricesQuery);
  const perFriend = usdToCoins(REFERRAL_USD, prices.coin);
  const { state } = useMining();
  const referrals = useReferrals();
  const link = referrals.data ? inviteLink(referrals.data.userId) : null;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!link) return;
    haptic("light");
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const share = () => {
    if (!link) return;
    haptic("medium");
    const text = `Mine ${COIN_SYMBOL} with me and cash out in GRAM. You get a free $7 welcome gift.`;
    openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
    );
  };

  const earned = referrals.data?.earnedCoins ?? 0;

  return (
    <AppScreen>
      <UserHeader balance={state.coins} />

      <section className="page-heading" data-enter>
        <h1 className="text-4xl font-extrabold tracking-normal">Invite friends</h1>
      </section>

      <section className="referral-reward" data-enter>
        <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent"><Gift className="h-6 w-6" /></span>
        <div><p className="mb-2 text-xs text-muted-foreground">FOR EVERY FRIEND</p><p className="reward-number">+{perFriend.toFixed(1)} <span className="text-accent text-xl">{COIN_SYMBOL}</span></p></div>
        <p className="font-medium text-success">≈ ${REFERRAL_USD} per referral</p>
      </section>

      <section className="referral-stats grid grid-cols-3 gap-3" data-enter>
        <Stat icon={<Users className="h-5 w-5" />} value={referrals.data?.qualified ?? 0} label="QUALIFIED" highlight />
        <Stat icon={<Clock className="h-5 w-5" />} value={referrals.data?.pending ?? 0} label="PENDING" />
        <Stat icon={<GramMark className="h-5 w-5" />} value={Number(earned.toFixed(1))} label="EARNED" />
      </section>

      <section className="invite-panel" data-enter>
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">YOUR INVITE LINK</p>
        <div className="mt-3 truncate rounded-xl border border-border bg-background px-4 py-3.5 font-mono text-sm">
          {link ?? (referrals.inTelegram ? "Loading your invite link…" : "Open in Telegram")}
        </div>
        <div className="mt-3 grid grid-cols-[2fr_3fr] gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={copy}
            disabled={!link}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-background font-bold transition active:scale-95"
          >
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            type="button"
            onClick={share}
            disabled={!link}
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-peach-gradient font-bold text-primary-foreground shadow-peach transition active:scale-95"
          >
            <Share className="h-5 w-5" /> Share invite
          </Button>
        </div>
      </section>

      {!referrals.inTelegram && <Button variant="outline" className="mt-4 w-full" onClick={() => openTelegramLink(BOT_URL)}>Open Telegram bot <ChevronRightIcon /></Button>}
      {referrals.error && <div role="alert" className="mt-4 text-sm text-destructive">{referrals.error.message}<Button variant="ghost" onClick={() => void referrals.refetch()}>Retry</Button></div>}
      {(referrals.data?.awaitingPriceUsd ?? 0) > 0 && <p className="mt-4 text-sm text-muted-foreground">${referrals.data?.awaitingPriceUsd} awaiting GEMSTON market price.</p>}
      {referrals.data && referrals.data.friends.length > 0 && <section className="mt-6 border-t border-border pt-4">
        <h2 className="font-semibold">Recent friends · {referrals.data.total}</h2>
        <ul className="mt-3 divide-y divide-border">{referrals.data.friends.map((friend, index) => <li key={`${friend.joinedAt}-${index}`} className="flex items-center justify-between gap-3 py-3 text-sm">
          <span className="min-w-0 break-words">{friend.name || "Telegram friend"}</span>
          <span className={`flex shrink-0 items-center gap-1 ${friend.qualified ? "text-success" : "text-muted-foreground"}`}>{friend.qualified ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}{friend.qualified ? "Qualified" : "Pending withdrawal"}</span>
        </li>)}</ul>
      </section>}

      <section className="steps-panel" data-enter>
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">HOW IT WORKS</p>
        <ol className="mt-4 space-y-4">
          {[
            "Share your link.",
            "Your friend joins and withdraws.",
            `Earn $${REFERRAL_USD} in ${COIN_SYMBOL}.`,
          ].map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </AppScreen>
  );
}

function ChevronRightIcon() { return <Share className="h-4 w-4" />; }

function Stat({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-card px-2 py-4">
      <span
        className={
          highlight
            ? "flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent"
            : "flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        }
      >
        {icon}
      </span>
      <span className="mt-3 text-2xl font-extrabold tabular-nums">{value}</span>
      <span className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
