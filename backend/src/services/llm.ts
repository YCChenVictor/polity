// LLMService.ts
import OpenAI from "openai";

export interface ConstitutionalCheckInput {
  title: string;
  actor: string;
  date: string | number | Date;
  description: string;
}

export interface ConstitutionalCheckResult {
  verdict: "constitutional" | "unconstitutional" | "unclear";
  reason: string;
  confidence?: number;
  analysis: Record<string, string>;
}

export class LLMService {
  private ai: OpenAI;

  constructor(apiKey = process.env.OPENAI_API_KEY) {
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    this.ai = new OpenAI({ apiKey });
  }

  //   async constitutionalCheck(
  //     ev: ConstitutionalCheckInput,
  //   ): Promise<ConstitutionalCheckResult> {
  //     const prompt = `你是台灣（中華民國）憲法審查助理。請依下列七個面向逐點判斷此「事件/作為」是否違憲，並輸出結論與理由：
  // - 程序合法性
  // - 明文衝突
  // - 功能性影響
  // - 比例原則
  // - 平等原則
  // - 權力分立
  // - 合憲解釋可能性

  // 事件:
  // Title: ${event.title}
  // Actor: ${event.actor}
  // Date: ${new Date(event.date).toLocaleString()}
  // Description: ${event.description}`;

  //     const resp = await this.ai.chat.completions.create({
  //       model: "gpt-5",
  //       messages: [
  //         { role: "system", content: "請依 JSON Schema 輸出。" },
  //         { role: "user", content: prompt },
  //       ],
  //       response_format: {
  //         type: "json_schema",
  //         json_schema: {
  //           name: "ConstitutionCheck",
  //           strict: true,
  //           schema: {
  //             type: "object",
  //             additionalProperties: false,
  //             properties: {
  //               verdict: {
  //                 type: "string",
  //                 enum: ["constitutional", "unconstitutional", "unclear"],
  //               },
  //               reason: { type: "string", minLength: 1, maxLength: 600 },
  //               confidence: { type: "number", minimum: 0, maximum: 1 },
  //               analysis: {
  //                 type: "object",
  //                 additionalProperties: { type: "string" },
  //                 description: "針對七個面向的逐點分析",
  //               },
  //             },
  //             required: ["verdict", "reason", "analysis"],
  //           },
  //         },
  //       },
  //     });

  //     const out = JSON.parse(response.choices[0].message.content || "{}");

  //     return {
  //       verdict: out.verdict as VerdictType,
  //       reason: String(out.reason || ""),
  //       confidence:
  //         typeof out.confidence === "number" ? out.confidence : undefined,
  //       analysis: out.analysis || {},
  //     };
}

// export a singleton instance (use this in your router)
export const llmService = new LLMService();
