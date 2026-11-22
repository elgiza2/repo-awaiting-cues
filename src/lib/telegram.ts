/** Minimal Telegram Mini App helpers (the SDK script is loaded in the root head). */

export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TgWebApp {
  initData?: string;
  initDataUnsafe?: { user?: TgUser; start_param?: string };
  ready?: () => void;
  expand?: () => void;
  requestFullscreen?: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
  isVersionAtLeast?: (v: string) => boolean;
  HapticFeedback?: { impactOccurred?: (s: "light" | "medium" | "heavy") => void };
}

export const getWebApp = (): TgWebApp | null => {
  if (typeof window === "undefined") return null;
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp ?? null;
};

export const initTelegramFullscreen = () => {
  const app = getWebApp();
  if (!app) return;
  try {
    app.ready?.();
    app.expand?.();
    if (app.isVersionAtLeast?.("8.0")) app.requestFullscreen?.();
    app.disableVerticalSwipes?.();
    app.setHeaderColor?.("#0b0a09");
    app.setBackgroundColor?.("#0b0a09");
  } catch {
    /* older clients */
  }
};

export const getTelegramUser = (): TgUser | null => getWebApp()?.initDataUnsafe?.user ?? null;

export const haptic = (style: "light" | "medium" | "heavy" = "light") => {
  try {
    getWebApp()?.HapticFeedback?.impactOccurred?.(style);
  } catch {
    /* ignore */
  }
};

export const openTelegramLink = (url: string) => {
  const app = getWebApp() as (TgWebApp & { openTelegramLink?: (u: string) => void; openLink?: (u: string) => void }) | null;
  try {
    if (app?.openTelegramLink && url.startsWith("https://t.me/")) return app.openTelegramLink(url);
    if (app?.openLink) return app.openLink(url);
  } catch {
    /* fall through */
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
