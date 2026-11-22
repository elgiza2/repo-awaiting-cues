/** Wallets fetch the manifest themselves, so it must be on a publicly reachable host. */
export const TON_MANIFEST_URL = "https://repo-awaiting-cues.lovable.app/tonconnect-manifest.json";

// Private preview hosts and the -dev host can return 403 to a wallet's servers.
// Use the publicly accessible published identity on both SSR and browser renders.
export const tonManifestUrl = () => TON_MANIFEST_URL;
