import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { DataSlabs } from "./DataSlabs";
import { useReferrals } from "@/hooks/use-referrals";

export function AppScreen({ children, home = false }: { children: ReactNode; home?: boolean }) {
  useReferrals();
  const screen = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = Array.from(screen.current?.querySelectorAll("[data-enter]") ?? []).map((element, index) =>
      element.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 450, delay: index * 45, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }));
    return () => animations.forEach((animation) => animation.cancel());
  }, [location.pathname]);
  return (
    <div ref={screen} className={`gem-app ${home ? "is-home" : "is-content"}`}>
      <main className="app-main">
        {!home && <DataSlabs className="page-art" />}
        <div className="page-body">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
