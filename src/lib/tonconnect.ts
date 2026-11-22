/** Wallets fetch the manifest themselves, so it must be on a publicly reachable host. */
const PUBLIC_PREVIEW_ORIGIN = "https://project--427a8818-4b19-402c-84f5-267242b69aaf-dev.lovable.app";

export const tonManifestUrl = () => {
  if (typeof window === "undefined") return `${PUBLIC_PREVIEW_ORIGIN}/tonconnect-manifest.json`;
  const { origin, hostname } = window.location;
  const isPrivate = hostname.startsWith("id-preview--") || hostname === "localhost" || hostname === "127.0.0.1";
  return `${isPrivate ? PUBLIC_PREVIEW_ORIGIN : origin}/tonconnect-manifest.json`;
};
