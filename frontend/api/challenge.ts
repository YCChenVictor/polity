import { generateNonce, SiweMessage } from "siwe";
import { serialize } from "cookie";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "dotenv";

const NONCE_MAX_AGE = 300;
const NONCE_NAME = "__Host-siwe-nonce";

if (process.env.NODE_ENV === "dev") {
  config({ path: ".env.local" });
}

const nonceSecret = process.env.NONCE_SECRET;
if (!nonceSecret) {
  throw Error("No NONCE_SECRET");
}

interface BuildSiweParams {
  address: `0x${string}`;
  chainId?: number;
  host: string;
  proto?: "http" | "https";
  nonce: string; // jti
}

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

const handler = (req: VercelRequest, res: VercelResponse) => {
  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  const { address, chainId } = body;
  if (!address) return res.status(400).json({ error: "address required" });

  const host =
    (req.headers["x-forwarded-host"] as string) ??
    (req.headers["host"] as string);
  if (!host) return res.status(400).json({ error: "bad host" });

  const { nonce, setCookie } = issueNonceCookie();
  const { prepared } = buildSiweMessage({ address, chainId, host, nonce });

  res.setHeader("Set-Cookie", setCookie);
  return res.status(200).json({ message: prepared });
};

export default handler;
export { buildSiweMessage, issueNonceCookie };
