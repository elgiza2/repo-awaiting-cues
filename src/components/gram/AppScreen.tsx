import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

/** Page frame: top glow, safe-area padding, bottom nav. */
export function AppScreen({ children }: { children: ReactNode }) {
  return (
    <div className="bg-top-glow min-h-screen">
      <main className="mx-auto max-w-md px-5 pt-[calc(var(--tg-safe-area-inset-top,0px)+var(--tg-content-safe-area-inset-top,0px)+1.25rem)] pb-32">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
