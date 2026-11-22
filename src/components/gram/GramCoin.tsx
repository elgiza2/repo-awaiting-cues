import { cn } from "@/lib/utils";
import { GramMark } from "./GramMark";

/** Big metallic GRAM coin. `active` adds a slow spin to the ticked ring. */
export function GramCoin({ active = false, className }: { active?: boolean; className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full animate-coin-float", className)}>
      <div className="absolute inset-[6%] rounded-full shadow-coin" />
      <div className="coin-ring absolute inset-0 rounded-full p-[4.5%]">
        <div className={cn("coin-ticks absolute inset-0 rounded-full", active && "animate-coin-spin")} />
        <div className="coin-core relative flex h-full w-full items-center justify-center rounded-full ring-1 ring-peach/25">
          <div className="absolute inset-[4%] rounded-full ring-1 ring-peach/10" />
          <GramMark className="w-[44%] text-peach drop-shadow-[0_6px_18px_color-mix(in_oklab,var(--peach)_35%,transparent)]" />
        </div>
      </div>
    </div>
  );
}
