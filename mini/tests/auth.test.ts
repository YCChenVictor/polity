import { describe, it, expect, vi } from "vitest";
import request from "supertest";

import challengeHandler from "../api/auth/challenge";
import verifyHandler from "../api/auth/verify";
import { fromVercel } from "./setup";

// 1) Partial mock: keep real functions, override only isValidSiwe
vi.mock("../lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/auth")>();
  return {
    ...actual,
    isValidSiwe: vi.fn(), // we'll control this
  };
});

// 2) Import after vi.mock
import { isValidSiwe, buildSiweMessage } from "../lib/auth";

describe("challenge", () => {
  it("calls challenge and returns true on success", async () => {
    const app = fromVercel(challengeHandler);
    const uploadRes = await request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send({
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        chainId: 31337,
      });

    expect(uploadRes.status).toBe(200);
    const setCookie = uploadRes.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(Array.isArray(setCookie)).toBe(true);
    expect(setCookie[0]).toMatch(/__Host-siwe-nonce=/);
  });
});

describe("verify", () => {
  it("calls verify and setup JWT cookie", async () => {
    isValidSiwe.mockResolvedValue(true);

    const host = "localhost:3000";
    const nonce = "NONCE123";

    // 3) Use your real builder to create a valid SIWE message string
    const { prepared } = buildSiweMessage({
      host,
      nonce,
      address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      chainId: 1,
    });

    const app = fromVercel(verifyHandler);
    const res = await request(app)
      .post("/")
      .set("Host", host)
      .set("Content-Type", "application/json")
      .set("Cookie", `__Host-siwe-nonce=${nonce}`)
      .send({
        message: prepared, // ✅ valid SIWE string
        signature: "dummy_sig", // 🔹 ignored by mocked isValidSiwe
      });

    expect(res.status).toBe(200);
    expect(isValidSiwe).toHaveBeenCalledTimes(1);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
