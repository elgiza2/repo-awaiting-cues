import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getTelegramUser, type TgUser } from "@/lib/telegram";
import { COIN_SYMBOL } from "@/lib/mining";
import { GramMark } from "./GramMark";

export function UserHeader({ balance }: { balance: number }) {
  const [user, setUser] = useState<TgUser | null>(null);
  useEffect(() => setUser(getTelegramUser()), []);

  const name = user ? [user.first_name, user.last_name].filter(Boolean).join(" ") : "Miner";
  const handle = user?.username ? `@${user.username}` : "GEMSTON miner";

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={name}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-extrabold text-peach ring-1 ring-border">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold leading-tight">{name}</p>
          <p className="truncate text-sm text-muted-foreground">{handle}</p>
        </div>
      </div>

      <Link
        to="/wallet"
        className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card/70 py-1.5 pl-1.5 pr-3 backdrop-blur"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <GramMark className="h-4 w-4 text-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
            BALANCE
          </span>
          <span className="block text-[13px] font-bold tabular-nums">{balance.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} {COIN_SYMBOL}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </header>
  );
}
