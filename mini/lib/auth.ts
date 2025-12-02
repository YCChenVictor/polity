import { generateNonce, SiweMessage } from "siwe";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { VercelRequest } from "@vercel/node";
import cookie from "cookie";

const NONCE_MAX_AGE = 300;
const NONCE_NAME = "__Host-siwe-nonce";

const reactAppSessionSecret = process.env.SESSION_SECRET;
if (!reactAppSessionSecret) {
  throw Error("No SESSION_SECRET");
}

interface BuildSiweParams {
  address: `0x${string}`;
  chainId?: number;
  host: string;
  proto?: "http" | "https";
  nonce: string; // jti
}

type SiweInput = SiweMessage | string;

// Cookie: stores the nonce in an httpOnly cookie in the browse
// Nonce: Nonce = one-time random ID for a login attempt.
// When you send back the message and signature, the backend reads the nonce from your cookie and from the signed message, and only accepts the login if they match and that nonce hasn’t been used before.
//
const issueNonceCookie = () => {
  const nonce = generateNonce();
  const setCookie = serialize(NONCE_NAME, nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: NONCE_MAX_AGE,
  });
  return { nonce, setCookie };
};

const buildSiweMessage = (p: BuildSiweParams) => {
  const msg = new SiweMessage({
    domain: p.host,
    address: p.address,
    statement: "Sign in to Polity.",
    uri: `https://${p.host}`,
    version: "1",
    chainId: p.chainId ?? 1,
    nonce: p.nonce,
  });

  return { msg, prepared: msg.prepareMessage() };
};

const isValidSiwe = async (
  messageInput: SiweInput,
  signature: string,
  cookieNonce: string,
  host: string,
  now = new Date(),
): Promise<boolean> => {
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

const getSessionFromRequest = (req: VercelRequest) => {
  const isProd = process.env.NODE_ENV === "production";
  const name = isProd ? "__Host-polity-session" : "polity-session";

  const header = req.headers.cookie ?? "";
  const cookies = req.cookies ?? (header ? cookie.parse(header) : {});

  const token = cookies[name];
  if (!token) return null;

  try {
    return jwt.verify(token, reactAppSessionSecret);
  } catch {
    return null;
  }
};

export {
  getSessionFromRequest,
  clearNonceCookie,
  buildSessionCookie,
  isValidSiwe,
  issueNonceCookie,
  buildSiweMessage,
};
