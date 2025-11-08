import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SiweMessage } from "siwe";
import { parse, serialize } from "cookie";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const cookies = parse(req.headers.cookie ?? "");
  const nonceCookie = cookies["siwe-nonce"];
  if (!nonceCookie) {
    return res.status(400).json({ ok: false, error: "No nonce cookie" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  const { message, signature } = body;
  if (!message || !signature)
    return res.status(400).json({ ok: false, error: "Missing payload" });

  const siwe = new SiweMessage(message);
  const domain = req.headers.host ?? "";

  const { success, data } = await siwe.verify({
    signature,
    domain,
    nonce: nonceCookie,
  });
  if (!success) return res.status(401).json({ ok: false });

  // rotate nonce + set a simple session (replace with JWT if needed)
  res.setHeader("Set-Cookie", [
    serialize("siwe-nonce", "", { path: "/", maxAge: -1 }),
    serialize("siwe-session", JSON.stringify({ address: data.address }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }),
  ]);
  res.status(200).json({ ok: true, address: data.address });
}
