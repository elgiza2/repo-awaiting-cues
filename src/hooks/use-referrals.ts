import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { syncReferrals } from "@/lib/referrals.functions";
import { getWebApp } from "@/lib/telegram";

export function useReferrals() {
  const [initData, setInitData] = useState("");
  const sync = useServerFn(syncReferrals);
  useEffect(() => {
    const read = () => setInitData(getWebApp()?.initData ?? "");
    read();
    const timer = setInterval(read, 2000);
    return () => clearInterval(timer);
  }, []);
  const query = useQuery({
    queryKey: ["telegram-referrals", initData],
    queryFn: () => sync({ data: { initData } }),
    enabled: Boolean(initData),
    refetchInterval: 30000,
    staleTime: 15000,
    retry: false,
  });
  return { ...query, inTelegram: Boolean(initData) };
}