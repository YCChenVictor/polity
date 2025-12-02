import type { VercelRequest, VercelResponse } from "@vercel/node";
import { judgeCheck } from "../../lib/llm";
import { readRawBody } from "../../lib/helper";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // 🔹 read & parse JSON
    const raw = await readRawBody(req);
    let body = {};
    if (raw.length) {
      try {
        body = JSON.parse(raw.toString("utf8"));
      } catch {
        res.status(400).json({ error: "Invalid JSON" });
        return;
      }
    }

    const { ruleCid, contentCid } = body as {
      ruleCid?: string;
      contentCid?: string;
    };

    if (!ruleCid || !contentCid) {
      res.status(400).json({ error: "ruleCid and contentCid are required" });
      return;
    }

    const judgement = await judgeCheck(ruleCid, contentCid);

    if (!judgement) {
      res.status(400).json({ error: "File content not acceptable" });
      return;
    }

    res.status(200).json({ judgement });
    return;
  } catch (err) {
    res.status(500).json({
      error: `Failed to check compliance data: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
    return;
  }
}
