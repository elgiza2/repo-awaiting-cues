import { queryOptions } from "@tanstack/react-query";

/** GRAM is the native TON asset on STON.fi; GEMSTON is the in-game coin's market. */
const STON_ASSET = "https://api.ston.fi/v1/assets/";
export const GRAM_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
export const COIN_ADDRESS = "EQBX6K9aXVl3nXINCyPPL86C4ONVmQ8vK360u6dykFKXpHCa";

export const GRAM_SWAP_URL =
  "https://app.ston.fi/swap?chartVisible=false&ft=GRAM&tt=GEMSTON&fa=%221%22";

export interface Prices {
  gram: number | null;
  coin: number | null;
  updatedAt: number;
}

const fetchAssetUsd = async (address: string): Promise<number | null> => {
  try {
    const res = await fetch(STON_ASSET + address, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      asset?: { dex_price_usd?: string; third_party_price_usd?: string };
    };
    const raw = json.asset?.dex_price_usd ?? json.asset?.third_party_price_usd;
    const usd = raw != null ? Number(raw) : NaN;
    return Number.isFinite(usd) && usd > 0 ? usd : null;
  } catch {
    return null;
  }
};

export const fetchPrices = async (): Promise<Prices> => {
  const [gram, coin] = await Promise.all([fetchAssetUsd(GRAM_ADDRESS), fetchAssetUsd(COIN_ADDRESS)]);
  return { gram, coin, updatedAt: Date.now() };
};

export const pricesQuery = queryOptions({
  queryKey: ["prices"],
  queryFn: fetchPrices,
  refetchInterval: 15_000,
  staleTime: 10_000,
});

export const formatUsd = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  })}`;
