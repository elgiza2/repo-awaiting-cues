import { Link } from "@tanstack/react-router";
import { ClipboardCheck, Cpu, Users, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { GramMark } from "./GramMark";

const items: { to: "/" | "/tasks" | "/refer" | "/wallet" | "/servers"; label: string; icon: ReactNode; dot?: boolean }[] = [
  { to: "/", label: "Home", icon: <GramMark className="h-5 w-5" /> },
  { to: "/tasks", label: "Tasks", icon: <ClipboardCheck className="h-5 w-5" />, dot: true },
  { to: "/refer", label: "Refer", icon: <Users className="h-5 w-5" /> },
  { to: "/servers", label: "Servers", icon: <Cpu className="h-5 w-5" /> },
  { to: "/wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" />, dot: true },
];

export function BottomNav() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="group relative flex flex-col items-center gap-1 pt-3 pb-1 text-xs font-semibold text-muted-foreground transition-colors data-[status=active]:text-peach"
              activeOptions={{ exact: true }}
            >
              <span className="absolute inset-x-6 top-0 h-px bg-peach opacity-0 shadow-peach transition-opacity group-data-[status=active]:opacity-100" />
              <span className="relative">
                {item.icon}
                {item.dot && (
                  <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
