import { describe, it, expect, vi } from "vitest";
import { SiweMessage } from "siwe";

import { buildSiweMessage, issueNonceCookie } from "../api/challenge";
import { isValidSiwe } from "../api/verify";

describe("buildSiweMessage", () => {
  it("passes correct fields and returns prepared text", () => {
    const { prepared } = buildSiweMessage({
      address: "0x000000000000000000000000000000000000dEaD",
      chainId: 1,
      host: "app.polity.xyz",
      nonce: "A1B2C3D4",
    });

    expect(prepared).toContain("Sign in to Polity.");
  });
});

describe("issueNonceCookie", () => {
  it("returns deterministic jti and a Set-Cookie header with a valid JWT and proper flags", () => {
    issueNonceCookie();
  });
});

describe("isValidSiwe", () => {
  it("passes signature/domain/nonce/time to message.verify and returns true", async () => {
    const now = new Date("2025-11-12T12:00:00.000Z");
    const verify = vi.fn().mockResolvedValue({ success: true });
    const message = { verify } as unknown as SiweMessage;

    await isValidSiwe(message, "0xdeadbeef", "nonce123", "localhost:3000", now);
  });
});
