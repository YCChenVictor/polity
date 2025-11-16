import type { VercelRequest, VercelResponse } from "@vercel/node";

import { hello } from "../lib/hello"

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const message = hello()
  res.status(200).json({ ok: true, msg: message });
  return;
}
