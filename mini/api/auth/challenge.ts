import { VercelRequest, VercelResponse } from "@vercel/node";

import { issueNonceCookie, buildSiweMessage } from "../../lib/auth";

const handler = (req: VercelRequest, res: VercelResponse) => {
  const body =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  const { address, chainId } = body;
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
