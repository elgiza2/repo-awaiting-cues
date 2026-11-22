import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Rocket, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { AppScreen } from "@/components/gram/AppScreen";
import { GramMark } from "@/components/gram/GramMark";
import { UserHeader } from "@/components/gram/UserHeader";
import { useMining } from "@/hooks/use-mining";
import { pricesQuery } from "@/lib/gram-price";
import { COIN_SYMBOL, TASK_USD, usdToCoins } from "@/lib/mining";
import { TASKS, type GramTask } from "@/lib/tasks";
import { haptic, openTelegramLink } from "@/lib/telegram";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — GEMSTON Miner" },
      { name: "description", content: "Community and Talon tasks with GEMSTON rewards at live prices." },
      { property: "og:title", content: "Tasks — GEMSTON Miner" },
      { property: "og:description", content: "Community and Talon tasks with GEMSTON rewards at live prices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(pricesQuery),
  component: TasksPage,
});

function TasksPage() {
  const { data: prices } = useSuspenseQuery(pricesQuery);
  const reward = usdToCoins(TASK_USD, prices.coin);
  const { state, completeTaskReward } = useMining();
  const left = TASKS.filter((t) => !state.completedTasks.includes(t.id)).length;

  return (
    <AppScreen>
      <UserHeader balance={state.coins} />

      <section className="mt-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Tasks</h1>
        <p className="mt-3 text-muted-foreground">
          {left === 0 ? "All done. New tasks drop daily." : `${left} task${left > 1 ? "s" : ""} left. Rewards credit instantly.`}
        </p>
      </section>

      <ul className="mt-6 space-y-3">
        {TASKS.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            reward={reward}
            done={state.completedTasks.includes(task.id)}
            onComplete={() => completeTaskReward(task.id, reward)}
          />
        ))}
      </ul>

      <p className="mx-auto mt-6 max-w-xs text-center text-sm text-muted-foreground">
        Membership is verified on our side. Leaving a channel after claiming may reverse the reward.
      </p>
    </AppScreen>
  );
}

type Phase = "idle" | "checking" | "ready";

function TaskCard({
  task,
  reward,
  done,
  onComplete,
}: {
  task: GramTask;
  reward: number;
  done: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase !== "checking") return;
    const id = setTimeout(() => setPhase("ready"), 6000);
    return () => clearTimeout(id);
  }, [phase]);

  const onClick = () => {
    haptic("light");
    if (done) return;
    if (phase === "ready") {
      onComplete();
      haptic("heavy");
      return;
    }
    openTelegramLink(task.url);
    setPhase("checking");
  };

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-gold-border bg-card p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-telegram/15 ring-1 ring-telegram/30">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-telegram text-telegram-foreground">
          {task.kind === "channel" ? <Send className="h-4 w-4 -translate-x-px" /> : <Rocket className="h-4 w-4" />}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{task.title}</p>
        <p className="truncate text-sm text-muted-foreground">{task.handle}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <GramMark className="h-4 w-4 text-foreground" />
          <span className="whitespace-nowrap rounded-full bg-muted px-2.5 py-0.5 font-bold">
            +{reward.toFixed(1)} {COIN_SYMBOL}
          </span>
          <span className="whitespace-nowrap text-muted-foreground">≈ ${TASK_USD}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={done || phase === "checking" || reward <= 0}
        className="h-11 shrink-0 rounded-full bg-foreground px-4 font-bold text-background transition active:scale-95 disabled:bg-muted disabled:text-muted-foreground data-[ready=true]:bg-peach-gradient data-[ready=true]:text-primary-foreground"
        data-ready={phase === "ready" && !done}
      >
        {done ? <Check className="h-5 w-5" /> : phase === "checking" ? "Checking…" : phase === "ready" ? "Claim" : "Start"}
      </button>
    </li>
  );
}
