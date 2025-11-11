import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

if (process.env.NODE_ENV === "dev") {
  config({ path: ".env.local" });
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw Error("No SESSION_SECRET");
}

// In current vercel setting, there is no way to extract function outside api files
const verifySessionFromReq = (req: VercelRequest) => {
  console.log("zxcvzxcvzxcvzxcv");
  console.log(req.headers?.cookie);
  const isProd = process.env.NODE_ENV === "production";
  const name = isProd ? "__Host-polity-session" : "polity-session";
  const raw = parse(req.headers?.cookie ?? "")[name];
  console.log(parse(req.headers?.cookie ?? ""));
  try {
    const p = jwt.verify(raw ?? "", sessionSecret) as {
      address: string;
      chainId: number;
    };
    return { ok: true, address: p.address, chainId: p.chainId };
  } catch {
    return { ok: false };
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const v = verifySessionFromReq(req);
  if (!v.ok) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res
    .status(200)
    .json({ authenticated: true, address: v.address, chainId: v.chainId });
  return;
}
