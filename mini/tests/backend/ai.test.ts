import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

import handler from "../../api/ai/judge";

import { fromVercel } from "../setup";

import { storeText, UploadResult } from "../../lib/ipfs";

import * as judgeService from "../../lib/llm";

let rule: UploadResult;
let content: UploadResult;
describe("/api/judge", () => {
  beforeAll(async () => {
    rule = await storeText("RULE: 123", "rule-v1.txt", "/rules");
    content = await storeText("CONTENT: 123", "content.txt", "/contents");

    vi.spyOn(judgeService, "judgeCheck").mockImplementationOnce(async () => ({
      decision: "allow",
      ok: true,
      justification:
        "The content follows all provided rules with no violations.",
      violated_rules: [],
    }));
  });

  it("returns 200 when judgeCheck returns truthy", async () => {
    const app = fromVercel(handler);

    const response = await request(app)
      .post("/")
      .send({ contentCid: content.cid, ruleCid: rule.cid });

    expect(response.status).toBe(200);
  });
});
