import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { vi } from "vitest";

import app from "../../src/app";

import * as judgeService from "../../src/services/judge";

describe("POST /judges", () => {
  beforeAll(async () => {
    vi.spyOn(judgeService, "judgeCheck").mockImplementationOnce(async () => ({
      decision: "allow",
      ok: true,
      justification:
        "The content follows all provided rules with no violations.",
      violated_rules: [],
    }));
  });

  //

  it("200 OK when judgement passes", async () => {
    const res = await request(app)
      .post("/judges/")
      .send({ ruleFile: "constitution.md", contentFile: "constitution.md" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
});
