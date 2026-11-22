import { describe, expect, it } from "vitest";
import { tonManifestUrl } from "./tonconnect";

describe("wallet manifest", () => {
  it("uses the accessible published manifest rather than a private preview host", () => {
    expect(tonManifestUrl()).toBe("https://repo-awaiting-cues.lovable.app/tonconnect-manifest.json");
  });
});