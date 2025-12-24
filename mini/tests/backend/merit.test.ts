import { describe, it, afterAll, expect } from "vitest";
import { createServer } from "http";
import request from "supertest";
import crypto from "crypto";
import { keccak256, toBytes, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { fromVercel } from "../setup";
import meritHandler from "../../api/merit";
import { publicClient, walletClient } from "../../lib/viemClients";

const MERIT = process.env.MERIT_REGISTRY_ADDRESS as `0x${string}`;
const GH_SECRET = process.env.GH_WEBHOOK_SECRET!;
const REPO = (process.env.REPO_ALLOWLIST ?? "me/repo").split(",")[0]!.trim();

const MERIT_ABI = parseAbi([
  "function linkSubject(bytes32 subjectId,address account)",
  "function usedNonce(address,uint256) view returns (bool)",
]);

const attestor = privateKeyToAccount(process.env.ATTESTOR_PRIVATE_KEY as `0x${string}`);

function signGithub(raw: Buffer) {
  return "sha256=" + crypto.createHmac("sha256", GH_SECRET).update(raw).digest("hex");
}
const subjectIdFromGithub = (login: string) => keccak256(toBytes(`github:${login.toLowerCase()}`));
const nonceFromRepoPr = (repo: string, prNumber: number) =>
  BigInt(keccak256(toBytes(`github|${repo.toLowerCase()}|pr|${prNumber}`)));

const server = createServer(fromVercel(meritHandler));

describe("POST /api/merit", () => {
  afterAll(() => server.close());

  it("records contribution on merged PR", async () => {
    const login = "alice";
    const prNumber = 12;

    // link subject -> wallet so API won't ignore as unlinked
    const subjectId = subjectIdFromGithub(login);
    const citizen = "0x0000000000000000000000000000000000000001" as const;

    await walletClient.writeContract({
      address: MERIT,
      abi: MERIT_ABI,
      functionName: "linkSubject",
      args: [subjectId, citizen],
    });

    const payload = {
      pull_request: {
        merged: true,
        base: { ref: "main" },
        number: prNumber,
        html_url: `https://example/pr/${prNumber}`,
        merge_commit_sha: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
        user: { login },
      },
      repository: { full_name: REPO },
    };

    const raw = Buffer.from(JSON.stringify(payload));
    const sig = signGithub(raw);

    const resp = await request(server)
      .post("/api/merit")
      .set("Content-Type", "application/json")
      .set("x-github-event", "pull_request")
      .set("x-hub-signature-256", sig)
      .send(raw);

    expect(resp.status).toBe(200);
    expect(resp.body.ok).toBe(true);

    const nonce = nonceFromRepoPr(REPO, prNumber);
    const used = await publicClient.readContract({
      address: MERIT,
      abi: MERIT_ABI,
      functionName: "usedNonce",
      args: [attestor.address, nonce],
    });

    expect(used).toBe(true);
  });
});