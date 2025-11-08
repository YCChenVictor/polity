import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parse } from "cookie";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie ?? "");
  const raw = cookies["siwe-session"];
  if (!raw) return res.status(401).json({ ok: false });

  // tolerate plain JSON, URI-encoded JSON, or base64url JSON
  let session = null;
  try {
    session = JSON.parse(raw);
  } catch {
    try {
      session = JSON.parse(decodeURIComponent(raw));
    } catch {
      try {
        session = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
      } catch {
        /* ignore */
      }
    }
  }

  const address = session?.address;
  if (!address) return res.status(401).json({ ok: false });

  return res.status(200).json({ address });
}
