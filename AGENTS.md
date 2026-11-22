<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Game economy rules live in `src/lib/mining.ts` as pure functions with tests in `src/lib/mining.test.ts`; UI reads constants from there so values change in one place.
- Player progress is client-side (localStorage via `useMining`) until a backend exists; never treat it as trusted for payouts.
- Live prices come from STON.fi via `pricesQuery`; the router uses the SSR query integration so first render matches the server.
- TON Connect always uses the published `/tonconnect-manifest.json` identity; preview and -dev hosts can return 403 to wallets, so do not derive the manifest from the current browser origin.
- Suspend the withdrawal drawer while TON Connect is open and restore it on modal close; this avoids competing focus traps and accidental dismissals.
- Telegram welcome sends an asset-backed photo caption with verified sticker-set emoji IDs and styled buttons, with a native-emoji/link fallback on rejected formatting.
- Never display a successful withdrawal request until a verified payout service actually accepts it; local balances cannot authorize payments.
- Server catalogue prices and session rewards live in the pure economy module; wallet BOC submissions are stored locally as provisional purchases, never as verified payout authorization.
- All game routes share AppScreen and bottom navigation with no brand header or menu; DataSlabs owns the asset-backed video and reduced-motion still so presentation remains separate from game economy.
