import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { readFileFromMfs } from "./ipfs";
import { callGPT } from "./llm";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

interface Violation {
  id?: string;
  title?: string;
  rule_excerpt: string;
  rule_start: number;
  rule_end: number;
  content_excerpt: string;
  content_start: number;
  content_end: number;
  reason: string;
}

const schema = {
  type: "object",
  properties: {
    // design what to response from GPT API
    decision: { enum: ["allow", "deny", "unclear"] },
    justification: { type: "string", minLength: 1, maxLength: 240 }, // human-readable reason for the decision—so reviewers/users know why it was allowed/denied
    violated_rules: {
      // violated_rules is a list of the specific rules the content breaks (id/title/excerpt) with a short reason, so you can audit, show it in UI, or route logic.
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" }, // optional if your rules have IDs
          title: { type: "string" },
          rule_excerpt: { type: "string", minLength: 1 },
          rule_start: { type: "integer", minimum: 0 },
          rule_end: { type: "integer", minimum: 0 },
          content_excerpt: { type: "string", minLength: 1 },
          content_start: { type: "integer", minimum: 0 },
          content_end: { type: "integer", minimum: 0 },
          reason: { type: "string", minLength: 1 },
        },
        required: [
          "rule_excerpt",
          "rule_start",
          "rule_end",
          "content_excerpt",
          "content_start",
          "content_end",
          "reason",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["decision", "justification", "violated_rules"],
  allOf: [
    {
      if: { properties: { decision: { const: "deny" } } },
      then: { properties: { violated_rules: { minItems: 1 } } },
    },
    {
      if: { properties: { decision: { const: "allow" } } },
      then: { properties: { violated_rules: { maxItems: 0 } } },
    },
  ],
  additionalProperties: false,
};

const isViolation = (v: unknown): v is Violation => {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.rule_excerpt === "string" &&
    typeof o.rule_start === "number" &&
    typeof o.rule_end === "number" &&
    typeof o.content_excerpt === "string" &&
    typeof o.content_start === "number" &&
    typeof o.content_end === "number" &&
    typeof o.reason === "string"
  );
};

const okViolation = (v: Violation, rules: string, content: string): boolean =>
  v.rule_start >= 0 &&
  v.rule_end >= v.rule_start &&
  v.content_start >= 0 &&
  v.content_end >= v.content_start &&
  rules.slice(v.rule_start, v.rule_end) === v.rule_excerpt &&
  content.slice(v.content_start, v.content_end) === v.content_excerpt;

const judgeCheck = async (ruleFilePath: string, contentFilePath: string) => {
  const [rules, content] = await Promise.all([
    readFileFromMfs(ruleFilePath),
    readFileFromMfs(contentFilePath),
  ]);

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "Be a strict policy judge. Compare only the provided Rules and Content. " +
        "Return JSON per schema. `justification` must be 1–2 plain sentences. " +
        "For each violation, include exact rule/content excerpts and 0-based offsets.",
    },
    {
      role: "user",
      content: `Rules: """${String(rules)}"""\nContent: """${String(content)}"""`,
    },
  ];

  // --- GPT call ---
  const result = await callGPT(schema, messages);

  // --- validate ---
  const decision = ["allow", "deny", "unclear"].includes(result.decision)
    ? result.decision
    : "unclear";

  const justification =
    typeof result.justification === "string"
      ? result.justification.slice(0, 240)
      : "Invalid justification";

  const verified = (result.violated_rules as unknown[])
    .filter(isViolation)
    .filter((v) => okViolation(v, rules, content));

  // --- logical consistency checks ---
  if (decision === "deny" && verified.length === 0)
    return {
      decision: "unclear",
      ok: false,
      justification: "Unverifiable evidence from model.",
      violated_rules: [],
    };

  if (decision === "allow" && verified.length > 0)
    return {
      decision: "unclear",
      ok: false,
      justification: "Inconsistent: allow with violations.",
      violated_rules: [],
    };

  return {
    decision,
    ok: decision === "allow",
    justification,
    violated_rules: verified,
  };
};

export { judgeCheck };
