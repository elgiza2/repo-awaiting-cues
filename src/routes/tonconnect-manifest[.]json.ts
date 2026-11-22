import { createFileRoute } from "@tanstack/react-router";

/** TON Connect manifest; mirrors the requesting origin so wallets accept it on any deploy URL. */
export const Route = createFileRoute("/tonconnect-manifest.json")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        return Response.json(
          { url: origin, name: "GEMSTON Miner", iconUrl: `${origin}/gemston-icon.png` },
          { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=300" } },
        );
      },
    },
  },
});
