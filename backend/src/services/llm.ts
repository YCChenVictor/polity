// services/llmService.ts
import OpenAI from "openai";

export type VerdictType = "constitutional" | "unconstitutional" | "unclear";

export interface ConstitutionalCheckInput {
  title: string;
  actor: string;
  date: string | Date;
  description: string;
}

export interface ConstitutionalCheckResult {
  verdict: VerdictType;
  reason: string;
  confidence?: number;
  analysis?: Record<string, string>; // Seven-aspect breakdown
}

class LLMService {
  private ai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    this.ai = new OpenAI({ apiKey });
  }

  async constitutionalCheck(
    ev: ConstitutionalCheckInput,
  ): Promise<ConstitutionalCheckResult> {
    const prompt = `你是台灣（中華民國）憲法審查助理。請依下列七個面向逐點判斷此「事件/作為」是否違憲，並輸出結論與理由：
- 程序合法性
- 明文衝突
- 功能性影響
- 比例原則
- 平等原則
- 權力分立
- 合憲解釋可能性

事件:
Title: ${ev.title}
Actor: ${ev.actor}
Date: ${new Date(ev.date).toLocaleString()}
Description: ${ev.description}`;

    const response = await this.ai.chat.completions.create({
      model: "gpt-5", // or gpt-4o-mini
      messages: [
        { role: "system", content: "請依 JSON Schema 輸出。" },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ConstitutionCheck",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              verdict: {
                type: "string",
                enum: ["constitutional", "unconstitutional", "unclear"],
              },
              reason: { type: "string", minLength: 1, maxLength: 600 },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              analysis: {
                type: "object",
                additionalProperties: { type: "string" },
                description: "針對七個面向的逐點分析",
              },
            },
            required: ["verdict", "reason", "analysis"],
          },
        },
      },
    });

    const out = JSON.parse(response.choices[0].message.content || "{}");

    return {
      verdict: out.verdict as VerdictType,
      reason: String(out.reason || ""),
      confidence:
        typeof out.confidence === "number" ? out.confidence : undefined,
      analysis: out.analysis || {},
    };
  }
}

export default LLMService;
