export interface GramTask {
  id: string;
  title: string;
  handle: string;
  url: string;
  kind: "channel" | "app";
}

export const TASKS: GramTask[] = [
  {
    id: "join-community",
    title: "Join community",
    handle: "@gemstoe",
    url: "https://t.me/gemstoe",
    kind: "channel",
  },
  {
    id: "open-talon",
    title: "Play Talon",
    handle: "@Talonminibot",
    url: "https://t.me/Talonminibot?startapp=r6657246146",
    kind: "app",
  },
];
