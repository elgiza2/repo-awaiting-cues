import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Copy, Gift, Share, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AppScreen } from "@/components/gram/AppScreen";
import { GramMark } from "@/components/gram/GramMark";
import { UserHeader } from "@/components/gram/UserHeader";
import { useMining } from "@/hooks/use-mining";
import { inviteLink } from "@/lib/bot";
import { pricesQuery } from "@/lib/gram-price";
import { COIN_SYMBOL, REFERRAL_USD, usdToCoins } from "@/lib/mining";
import { getTelegramUser, haptic, openTelegramLink } from "@/lib/telegram";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Invite friends — GRAM Miner" },
      { name: "description", content: "Share your invite link and earn GRAM for every friend who starts mining." },
      { property: "og:title", content: "Invite friends — GRAM Miner" },
      { property: "og:description", content: "Share your invite link and earn GRAM for every friend who starts mining." },
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
  const [link, setLink] = useState(() => inviteLink(null));
  const [copied, setCopied] = useState(false);

  useEffect(() => setLink(inviteLink(getTelegramUser()?.id ?? null)), []);

  const copy = async () => {
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
    haptic("medium");
    const text = `Mine ${COIN_SYMBOL} with me and cash out in GRAM. You get a free $7 welcome gift.`;
    openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
    );
  };

  const earned = state.referrals * perFriend;

  return (
    <AppScreen>
      <UserHeader balance={state.coins} />

      <section className="mt-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Invite friends</h1>
        <p className="mt-3 text-muted-foreground">Your link works forever. There is no cap.</p>
      </section>

      <section className="bg-top-glow mt-6 rounded-3xl border border-gold-border bg-card px-6 py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Gift className="h-7 w-7" />
        </span>
        <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-muted-foreground">FOR EVERY FRIEND</p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">
          +{perFriend.toFixed(1)}
        </p>
        <p className="text-3xl font-extrabold tracking-tight text-accent">{COIN_SYMBOL}</p>
        <p className="mt-3 text-lg font-semibold text-success">≈ ${REFERRAL_USD} per referral</p>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={<Users className="h-5 w-5" />} value={state.referrals} label="FRIENDS" highlight />
        <Stat icon={<Clock className="h-5 w-5" />} value={0} label="PENDING" />
        <Stat icon={<GramMark className="h-5 w-5" />} value={Number(earned.toFixed(1))} label="EARNED" />
      </section>

      <section className="mt-4 rounded-3xl border border-border bg-card p-5">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">YOUR INVITE LINK</p>
        <div className="mt-3 truncate rounded-xl border border-border bg-background px-4 py-3.5 font-mono text-sm">
          {link}
        </div>
        <div className="mt-3 grid grid-cols-[2fr_3fr] gap-3">
          <button
            type="button"
            onClick={copy}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-background font-bold transition active:scale-95"
          >
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={share}
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-peach-gradient font-bold text-primary-foreground shadow-peach transition active:scale-95"
          >
            <Share className="h-5 w-5" /> Share invite
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-border bg-card p-5">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">HOW IT WORKS</p>
        <ol className="mt-4 space-y-4">
          {[
            "Send your link to a friend.",
            "They open the app and join our community.",
            `Once both are done, your $${REFERRAL_USD} in ${COIN_SYMBOL} lands.`,
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
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-2 py-4">
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
