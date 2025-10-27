// tests/judgeCheck.test.ts
import { describe, it, beforeEach, expect, vi } from "vitest";

// --- Mock dependencies used by judgeCheck ---
vi.mock("../ipfs/mfs", () => ({
  readFileFromMfs: vi.fn(),
}));

vi.mock("../llm/callGPT", () => ({
  callGPT: vi.fn(),
}));

vi.mock("../judge/validators", () => ({
  isViolation: vi.fn(),
  okViolation: vi.fn(),
}));

import { judgeCheck } from "../../../src/services/judge";
// import { readFileFromMfs } from "../ipfs/mfs";
// import { callGPT } from "../llm/callGPT";
// import { isViolation, okViolation } from "../judge/validators";

describe("judgeCheck", () => {
  const RULES = '1) No profanity.\n2) Content must mention "civics".';
  const CONTENT_OK = "This text talks about civics in a neutral tone.";
  const CONTENT_BAD = 'This is damn rude and does not mention "civics".';

  const rulePath = "/constitution.md";
  const contentPath = "/staging/post.md";

  beforeEach(() => {
    vi.clearAllMocks();

    // Default: pretend files exist
    // vi.mocked(readFileFromMfs).mockImplementation(async (p: string) => {
    //   if (p === rulePath) return RULES;
    //   if (p === contentPath) return CONTENT_OK;
    //   throw new Error("unexpected path");
    // });

    // // Default: permissive, no violations
    // vi.mocked(callGPT).mockResolvedValue({
    //   decision: "allow",
    //   justification: "All good.",
    //   violated_rules: [],
    // });

    // // Default validators
    // vi.mocked(isViolation).mockImplementation((v: any) => !!v && typeof v === "object");
    // vi.mocked(okViolation).mockImplementation(() => true);
  });

  //

  it("returns allow + ok=true when GPT allows and no verified violations", async () => {
    const res = await judgeCheck(rulePath, contentPath);
    expect(res).toEqual({
      decision: "allow",
      ok: true,
      justification: "All good.",
      violated_rules: [],
    });
  });

  // it("coerces invalid decision to 'unclear' and ok=false", async () => {
  //   vi.mocked(callGPT).mockResolvedValueOnce({
  //     decision: "approve", // invalid
  //     justification: "Weird decision token.",
  //     violated_rules: [],
  //   });

  //   const res = await judgeCheck(rulePath, contentPath);
  //   expect(res.decision).toBe("unclear");
  //   expect(res.ok).toBe(false);
  //   expect(res.justification).toBe("Weird decision token.");
  //   expect(res.violated_rules).toEqual([]);
  // });

  // it("returns unclear when decision=deny but no verified violations", async () => {
  //   vi.mocked(callGPT).mockResolvedValueOnce({
  //     decision: "deny",
  //     justification: "Says there are issues.",
  //     violated_rules: [], // nothing verifiable
  //   });

  //   const res = await judgeCheck(rulePath, contentPath);
  //   expect(res).toEqual({
  //     decision: "unclear",
  //     ok: false,
  //     justification: "Unverifiable evidence from model.",
  //     violated_rules: [],
  //   });
  // });

  // it("returns unclear when decision=allow but verified violations exist", async () => {
  //   // Make content actually “bad”
  //   vi.mocked(readFileFromMfs).mockImplementation(async (p: string) => {
  //     if (p === rulePath) return RULES;
  //     if (p === contentPath) return CONTENT_BAD;
  //     throw new Error("unexpected path");
  //   });

  //   const fakeViolation = {
  //     rule_start: 3,
  //     rule_end: 15,
  //     content_start: 8,
  //     content_end: 12,
  //     rule_excerpt: "No profanity",
  //     content_excerpt: "damn",
  //   };

  //   vi.mocked(callGPT).mockResolvedValueOnce({
  //     decision: "allow", // inconsistent with violations
  //     justification: "Appears fine.",
  //     violated_rules: [fakeViolation],
  //   });

  //   // validators say it’s valid and consistent with strings
  //   vi.mocked(isViolation).mockReturnValue(true);
  //   vi.mocked(okViolation).mockImplementation((_v, rules, content) => {
  //     return String(rules).includes("No profanity") && String(content).includes("damn");
  //   });

  //   const res = await judgeCheck(rulePath, contentPath);
  //   expect(res).toEqual({
  //     decision: "unclear",
  //     ok: false,
  //     justification: "Inconsistent: allow with violations.",
  //     violated_rules: [],
  //   });
  // });

  // it("truncates justification to 240 chars", async () => {
  //   const long = "x".repeat(300);
  //   vi.mocked(callGPT).mockResolvedValueOnce({
  //     decision: "allow",
  //     justification: long,
  //     violated_rules: [],
  //   });

  //   const res = await judgeCheck(rulePath, contentPath);
  //   expect(res.justification.length).toBe(240);
  // });

  // it("filters violations via isViolation + okViolation", async () => {
  //   const v1 = { tag: "keep" };
  //   const v2 = { tag: "drop" };
  //   vi.mocked(callGPT).mockResolvedValueOnce({
  //     decision: "deny",
  //     justification: "There are issues.",
  //     violated_rules: [v1, v2],
  //   });

  //   // Only v1 passes both guards
  //   vi.mocked(isViolation).mockImplementation((v: any) => v.tag === "keep" || v.tag === "drop");
  //   vi.mocked(okViolation).mockImplementation((v: any) => v.tag === "keep");

  //   const res = await judgeCheck(rulePath, contentPath);
  //   // deny + only one verified -> still deny branch, but function converts
  //   // "deny with some verified" to … actually it does NOT convert; it returns unclear only
  //   // when deny & verified.length === 0. So expect deny → but SUT returns decision as-is
  //   // at the end. However our SUT *does* return decision directly unless one of the
  //   // guard clauses fires. With verified length > 0, deny remains deny.
  //   //
  //   // Wait—SUT returns ok = (decision === "allow"); so ok=false here.
  //   expect(res.decision).toBe("deny");
  //   expect(res.ok).toBe(false);
  //   expect(res.violated_rules).toEqual([v1]);
  //   expect(res.justification).toBe("There are issues.");
  // });
});