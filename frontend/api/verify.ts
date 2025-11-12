import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { config } from "dotenv";

if (process.env.NODE_ENV === "dev") {
  config({ path: ".env.local" });
}

const reactAppSessionSecret = process.env.SESSION_SECRET;

if (!reactAppSessionSecret) {
  throw Error("No SESSION_SECRET");
}

// In current vercel setting, there is no way to extract function outside api files
const isValidSiwe = async (
  messageInput: SiweMessage,
  signature: string,
  cookieNonce: string,
  host: string,
  now = new Date(),
) => {
  const message =
    typeof messageInput === "string"
      ? new SiweMessage(messageInput)
      : messageInput;

  const { success } = await message.verify({
    signature,
    domain: host,
    nonce: cookieNonce,
    time: now.toISOString(),
  });

  return !!success;
};

const buildSessionCookie = ({
  address,
  chainId,
  ttlSec = 60 * 60 * 24 * 7,
  sameSite = "lax",
}: {
  address: string;
  chainId: number;
  ttlSec?: number;
  sameSite?: "lax" | "none" | "strict";
  name?: string;
}) => {
  const isProd = process.env.NODE_ENV === "production";
  const name = isProd ? "__Host-polity-session" : "polity-session";

  const token = jwt.sign(
    { sub: address, address, chainId },
    reactAppSessionSecret,
    {
      expiresIn: `${ttlSec}s`,
    },
  );
  const cookie = serialize(name, token, {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/",
    maxAge: ttlSec,
  });
  return { token, cookie };
};

const clearNonceCookie = (sameSite: "lax" | "none" | "strict" = "lax") => {
  const isProd = process.env.NODE_ENV === "production";
  const name = isProd ? "__Host-siwe-nonce" : "siwe-nonce";
  return serialize(name, "", {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/",
    maxAge: 0,
  });
};

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const message = req.body?.message;
  const signature = req.body?.signature;

  const cookie = parse(req.headers.cookie || "")["__Host-siwe-nonce"];
  if (!cookie)
    return res.status(401).json({ ok: false, reason: "missing_cookie_nonce" });

  const host = req.headers["x-forwarded-host"] as string;
  if (!host) throw new Error("missing_host");
  console.log(typeof message);
  const ok = await isValidSiwe(message, signature, cookie, host);

  if (!ok) return res.status(401).json({ ok: false });

  // It’s the /api/verify success step that invalidates the one-time SIWE nonce cookie (preventing replay) while your separate session cookie—set in the same response—now carries the login.
  const { cookie: sessionCookie } = buildSessionCookie({
    address: message.address,
    chainId: message.chainId,
    secure: (req.headers["x-forwarded-proto"] ?? "https") === "https",
  });
  res.setHeader("Set-Cookie", [sessionCookie, clearNonceCookie()]);
  return res.status(200).json({ ok: true, address: message.address });
};

export default handler;
export { isValidSiwe };
