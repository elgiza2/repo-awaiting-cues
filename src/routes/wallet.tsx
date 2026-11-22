import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { ArrowDownUp, ArrowUp, Check, ChevronRight, Info, Loader2, ShieldCheck, Users, Wallet, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AppScreen } from "@/components/gram/AppScreen";
import { GramMark } from "@/components/gram/GramMark";
import { UserHeader } from "@/components/gram/UserHeader";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useMining } from "@/hooks/use-mining";
import { formatUsd, pricesQuery } from "@/lib/gram-price";
import {
  checkWithdrawal,
  COIN_SYMBOL,
  coinsToGram,
  MIN_WITHDRAWAL,
  WITHDRAWAL_FEE,
  WITHDRAWAL_REFERRALS,
} from "@/lib/mining";
import { shortAddress, withdrawalFeeTx } from "@/lib/payments";
import { haptic } from "@/lib/telegram";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — GEMSTON Miner" },
      { name: "description", content: "Convert GEMSTON to GRAM at live prices and withdraw to your TON wallet." },
      { property: "og:title", content: "Wallet — GEMSTON Miner" },
      { property: "og:description", content: "Convert GEMSTON to GRAM at live prices and withdraw to your TON wallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
  component: WalletPage,
});

function WalletPage() {
  const { data: prices } = useSuspenseQuery(pricesQuery);
  const { state, convert, markFeePaid } = useMining();
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const [sheet, setSheet] = useState<"convert" | "withdraw" | null>(null);

  const gramUsd = state.gram * (prices.gram ?? 0);
  const coinsUsd = state.coins * (prices.coin ?? 0);

  return (
    <AppScreen>
      <UserHeader balance={state.coins} />

      <h1 className="mt-8 text-center text-4xl font-extrabold tracking-tight">Wallet</h1>

      <section className="bg-top-glow mt-6 rounded-3xl border border-border bg-card px-5 py-7 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">WITHDRAWABLE</p>
        <p className="mt-2 text-5xl font-extrabold tracking-tight tabular-nums">
          {state.gram.toFixed(3)} <span className="text-symbol-gradient">GRAM</span>
        </p>
        <p className="mt-2 text-lg font-semibold text-success">≈ {formatUsd(gramUsd)} USD</p>

        <button
          type="button"
          onClick={() => {
            haptic("medium");
            setSheet("withdraw");
          }}
          className="mt-6 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-peach-gradient text-lg font-bold text-primary-foreground shadow-peach transition active:scale-[0.98]"
        >
          <ArrowUp className="h-5 w-5" /> Withdraw GRAM
        </button>
        <p className="mt-3 text-sm text-muted-foreground">Min. {MIN_WITHDRAWAL} GRAM</p>
      </section>

      <section className="mt-4 flex items-center gap-4 rounded-3xl border border-gold-border bg-card p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background ring-1 ring-border">
          <GramMark className="h-6 w-6 text-peach" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">{COIN_SYMBOL}</p>
          <p className="text-xl font-extrabold tabular-nums">
            {state.coins.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-success">≈ {formatUsd(coinsUsd)}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            haptic("light");
            setSheet("convert");
          }}
          className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-foreground px-5 font-bold text-background transition active:scale-95"
        >
          <ArrowDownUp className="h-4 w-4" /> Convert
        </button>
      </section>

      <section className="mt-4 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background ring-1 ring-border">
            <GramMark className="h-4 w-4 text-foreground" />
          </span>
          <p className="font-bold">Live market</p>
          <span className="ml-auto h-2 w-2 rounded-full bg-success animate-live" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Tile label="GRAM" value={prices.gram != null ? formatUsd(prices.gram) : "—"} />
          <Tile label={COIN_SYMBOL} value={prices.coin != null ? formatUsd(prices.coin) : "—"} />
          <Tile
            label="RATE"
            value={
              prices.coin && prices.gram ? `${Math.round(prices.gram / prices.coin)} : 1` : "—"
            }
          />
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 shrink-0" />
          {prices.coin && prices.gram
            ? `${Math.round(prices.gram / prices.coin)} ${COIN_SYMBOL} ≈ 1 GRAM · prices from STON.fi`
            : "Prices from STON.fi"}
        </p>
      </section>

      <section className="mt-4 flex items-center gap-4 rounded-3xl border border-border bg-card p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Wallet className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{address ? "TON wallet connected" : "TON wallet"}</p>
          <p className="truncate font-mono text-sm text-muted-foreground">
            {address ? shortAddress(address) : "Not connected"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (address ? tonConnectUI.disconnect() : tonConnectUI.openModal())}
          className="flex shrink-0 items-center gap-1 font-bold text-accent"
        >
          {address ? "Disconnect" : "Connect"} <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      <p className="mx-auto mt-6 flex max-w-xs items-start gap-2 text-center text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        We only ever ask for a public address. Never share a seed phrase or private key with anyone, including us.
      </p>

      <ConvertSheet
        open={sheet === "convert"}
        onClose={() => setSheet(null)}
        coins={state.coins}
        coinUsd={prices.coin}
        gramUsd={prices.gram}
        onConvert={(amount) => convert(amount, prices.coin, prices.gram)}
      />

      <WithdrawSheet
        open={sheet === "withdraw"}
        onClose={() => setSheet(null)}
        gram={state.gram}
        feePaid={state.feePaid}
        referrals={state.referrals}
        address={address}
        onConnect={() => tonConnectUI.openModal()}
        onPayFee={async () => {
          await tonConnectUI.sendTransaction(withdrawalFeeTx());
          markFeePaid();
        }}
        onConvert={() => setSheet("convert")}
      />
    </AppScreen>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-2 py-3 text-center">
      <p className="truncate text-[11px] font-semibold tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} shouldScaleBackground={false}>
      <DrawerContent className="mx-auto max-w-md rounded-t-[2rem] border-border bg-card px-5 pb-8">
        <div className="mt-4 flex items-center justify-between">
          <DrawerTitle className="text-2xl font-extrabold">{title}</DrawerTitle>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

function ConvertSheet({
  open,
  onClose,
  coins,
  coinUsd,
  gramUsd,
  onConvert,
}: {
  open: boolean;
  onClose: () => void;
  coins: number;
  coinUsd: number | null;
  gramUsd: number | null;
  onConvert: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const value = Math.min(Number(amount) || 0, coins);
  const receive = coinsToGram(value, coinUsd, gramUsd);

  return (
    <Sheet open={open} onClose={onClose} title={`Convert ${COIN_SYMBOL}`}>
      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>You pay</span>
          <button type="button" className="font-bold text-accent" onClick={() => setAmount(String(coins))}>
            Max {coins.toFixed(2)}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="min-w-0 flex-1 bg-transparent text-3xl font-extrabold tabular-nums outline-none placeholder:text-muted-foreground"
          />
          <span className="font-bold">{COIN_SYMBOL}</span>
        </div>
      </div>
      <div className="-my-3 flex justify-center">
        <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
          <ArrowDownUp className="h-4 w-4" />
        </span>
      </div>
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">You receive</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex-1 text-3xl font-extrabold tabular-nums">{receive.toFixed(4)}</span>
          <span className="font-bold">GRAM</span>
        </div>
      </div>
      <button
        type="button"
        disabled={value <= 0 || receive <= 0}
        onClick={() => {
          haptic("heavy");
          onConvert(value);
          setAmount("");
          onClose();
        }}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-peach-gradient text-lg font-bold text-primary-foreground shadow-peach transition active:scale-[0.98] disabled:opacity-50"
      >
        Convert to GRAM
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Live STON.fi rate · no hidden fees</p>
    </Sheet>
  );
}

function WithdrawSheet({
  open,
  onClose,
  gram,
  feePaid,
  referrals,
  address,
  onConnect,
  onPayFee,
  onConvert,
}: {
  open: boolean;
  onClose: () => void;
  gram: number;
  feePaid: boolean;
  referrals: number;
  address: string;
  onConnect: () => void;
  onPayFee: () => Promise<void>;
  onConvert: () => void;
}) {
  const check = checkWithdrawal({ balance: gram, feePaid, referrals });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);

  const payFee = async () => {
    setError(null);
    setPaying(true);
    try {
      await onPayFee();
      haptic("heavy");
    } catch {
      setError("Payment was cancelled. Try again when you're ready.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Withdraw GRAM">

      {check.nextStep === "fee" && (
        <StepBody
          icon={<Wallet className="h-6 w-6" />}
          title={`Pay the ${WITHDRAWAL_FEE} GRAM fee`}
          text="A one-time network fee. It's paid straight from your connected TON wallet."
        >
          <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-left text-sm">
            <Line label="Fee" value={`${WITHDRAWAL_FEE} GRAM`} />
            <Line label="Wallet" value={address ? shortAddress(address) : "Not connected"} />
          </div>
          {error && <p className="mt-3 text-center text-sm text-destructive">{error}</p>}
          <PrimaryButton onClick={address ? payFee : onConnect} disabled={paying}>
            {paying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : address ? (
              <>Pay {WITHDRAWAL_FEE} GRAM</>
            ) : (
              <>Connect wallet <ChevronRight className="h-5 w-5" /></>
            )}
          </PrimaryButton>
        </StepBody>
      )}

      {check.nextStep === "invites" && (
        <StepBody
          icon={<Users className="h-6 w-6" />}
          title={`You need ${WITHDRAWAL_REFERRALS} invites`}
          text="A friend counts once they open the app and join our community."
        >
          <div className="mt-5 rounded-2xl border border-border bg-background p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">INVITES</p>
            <p className="mt-1 text-4xl font-extrabold tabular-nums">
              {referrals} <span className="text-muted-foreground">/ {WITHDRAWAL_REFERRALS}</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-peach-gradient"
                style={{ width: `${Math.min(100, (referrals / WITHDRAWAL_REFERRALS) * 100)}%` }}
              />
            </div>
            <p className="mt-4 font-semibold text-accent">
              {WITHDRAWAL_REFERRALS - referrals} more to unlock withdrawals
            </p>
          </div>
          <Link
            to="/refer"
            onClick={onClose}
            className="mt-5 flex h-14 w-full items-center justify-center gap-1 rounded-full bg-peach-gradient text-lg font-bold text-primary-foreground shadow-peach"
          >
            Get my invite link <ChevronRight className="h-5 w-5" />
          </Link>
        </StepBody>
      )}

      {check.nextStep === "balance" && (
        <StepBody
          icon={<ArrowDownUp className="h-6 w-6" />}
          title={`Reach ${MIN_WITHDRAWAL} GRAM`}
          text={`You have ${gram.toFixed(3)} GRAM. Convert more ${COIN_SYMBOL} to reach the minimum.`}
        >
          <PrimaryButton onClick={onConvert}>Convert {COIN_SYMBOL}</PrimaryButton>
        </StepBody>
      )}

      {check.nextStep === "ready" && (
        <StepBody
          icon={<Check className="h-6 w-6" />}
          title={requested ? "Request received" : "Ready to withdraw"}
          text={
            requested
              ? "Your withdrawal is queued. GRAM lands in your connected wallet after review."
              : `${gram.toFixed(3)} GRAM to ${address ? shortAddress(address) : "your wallet"}.`
          }
        >
          {!requested && (
            <PrimaryButton
              onClick={() => (address ? setRequested(true) : onConnect())}
            >
              {address ? "Withdraw now" : "Connect wallet"}
            </PrimaryButton>
          )}
        </StepBody>
      )}
    </Sheet>
  );
}

function StepBody({
  icon,
  title,
  text,
  children,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-peach">{icon}</span>
      <p className="mt-5 text-2xl font-extrabold">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-5 flex h-14 w-full items-center justify-center gap-1 rounded-full bg-peach-gradient text-lg font-bold text-primary-foreground shadow-peach transition active:scale-[0.98] disabled:opacity-60"
    >
      {children}
    </button>
  );
}
