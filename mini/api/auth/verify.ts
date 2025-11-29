import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SiweMessage } from "siwe";
import {  parse } from "cookie";
import { config } from "dotenv";
import { buildSessionCookie, clearNonceCookie, isValidSiwe } from "../../lib/auth";


const NONCE_NAME = "__Host-siwe-nonce";

if (process.env.NODE_ENV === "dev") {
  config({ path: ".env.local" });
}

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});

  const rawMessage = body.message as string | undefined;
  const signature = body.signature as string | undefined;

  if (!rawMessage || !signature) {
    res.status(400).json({ ok: false, reason: "missing_message_or_signature" });
    return;
  }

  const cookies = parse(req.headers.cookie || "");
  const nonceCookie = cookies[NONCE_NAME];
  if (!nonceCookie) {
    res.status(401).json({ ok: false, reason: "missing_cookie_nonce" });
    return;
  }

  const host =
    (req.headers["x-forwarded-host"] as string | undefined) ??
    (req.headers["host"] as string | undefined);
  if (!host) {
    res.status(400).json({ ok: false, reason: "missing_host" });
    return;
  }

  const ok = await isValidSiwe(rawMessage, signature, nonceCookie, host);
  if (!ok) {
    res.status(401).json({ ok: false, reason: "invalid_siwe" });
    return;
  }

  try {
  const siwe = new SiweMessage(rawMessage);

  const secure = (req.headers["x-forwarded-proto"] ?? "https") === "https";

  const sessionCookie = buildSessionCookie({
    address: siwe.address as `0x${string}`,
    chainId: siwe.chainId,
    secure,
  });

  res.setHeader("Set-Cookie", [sessionCookie, clearNonceCookie()]);
  res.status(200).json({ ok: true, address: siwe.address });
  return;
} catch {
  res.status(400).json({ ok: false, reason: "invalid_siwe_message" });
  return;
}
};

export default handler;
