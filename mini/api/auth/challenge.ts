import { VercelRequest, VercelResponse } from "@vercel/node";

import { issueNonceCookie, buildSiweMessage } from "../../lib/auth";
import { readRawBody } from "../../lib/helper";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const raw = await readRawBody(req);
  const text = raw.toString("utf8");
  const body = text ? JSON.parse(text) : {};

  const { address, chainId } = body as {
    address?: `0x${string}`;
    chainId?: number;
  };

  if (!address) {
    res.status(400).json({ error: "address required" });
    return;
  }

  const host =
    (req.headers["x-forwarded-host"] as string) ??
    (req.headers["host"] as string);
  if (!host) {
    res.status(400).json({ error: "bad host" });
    return;
  }

  const { nonce, setCookie } = issueNonceCookie();
  const { prepared } = buildSiweMessage({ address, chainId, host, nonce });

  res.setHeader("Set-Cookie", setCookie);
  res.status(200).json({ message: prepared });
  return;
};

export default handler;
export { buildSiweMessage, issueNonceCookie };
