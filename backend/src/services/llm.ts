import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const callGPT = async (
  schema: Record<string, unknown>,
  messages: ChatCompletionMessageParam[],
) => {
  const openai = new OpenAI();

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-5",
      temperature: 0,
      max_tokens: 300,
      seed: 7,
      response_format: {
        type: "json_schema",
        json_schema: { name: "policy_judgement", schema, strict: true },
      },
      messages,
    });

    const contentStr = resp.choices?.[0]?.message?.content?.trim();
    if (!contentStr) throw new Error("Empty GPT response");

    return JSON.parse(contentStr);
  } catch (err) {
    console.error("callGPT failed:", err);
    return null;
  }
};

export { callGPT };
