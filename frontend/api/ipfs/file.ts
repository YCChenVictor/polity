// npm i ipfs-http-client jsonwebtoken
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { create } from "ipfs-http-client";
import jwt from "jsonwebtoken";

const ipfs = create({ url: process.env.IPFS_API_URL! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const token = req.cookies["polity-session"];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  let address: string;
  try {
    ({ address } = jwt.verify(token, process.env.SESSION_SECRET!) as any);
  } catch {
    return res.status(401).json({ error: "bad session" });
  }

  const { name, content } = req.body || {};
  if (!name || typeof content !== "string")
    return res.status(400).json({ error: "bad payload" });

  const { cid } = await ipfs.add(
    { path: name, content: Buffer.from(content, "utf8") },
    { pin: true },
  );
  await ipfs.files
    .mkdir(`/polity/${address}`, { parents: true })
    .catch(() => {});
  await ipfs.files.cp(`/ipfs/${cid}`, `/polity/${address}/${name}`);

  return res.status(200).json({
    cid: cid.toString(),
    gateway: `${process.env.IPFS_GATEWAY}/ipfs/${cid}`,
  });
}
