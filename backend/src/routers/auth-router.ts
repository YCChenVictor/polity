import { Router } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { generateNonce, SiweMessage } from 'siwe';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

const authRouter = Router();

const JWT_EXPIRES = (process.env.JWT_EXPIRES || "1d") as SignOptions["expiresIn"];
const nonces = new Map<string, ReturnType<typeof setTimeout>>();
const keep = (n: string, ms = 5 * 60 * 1000) => { nonces.set(n, setTimeout(() => nonces.delete(n), ms)); };
const take = (n: string) => { const t = nonces.get(n); if (!t) return false; clearTimeout(t); nonces.delete(n); return true; };

authRouter.get("/nonce", (_req, res) => {
  const nonce = generateNonce();

  keep(nonce);
  res.json({ nonce });
});

authRouter.post("/verify", async (req, res) => {
  try {
    const { message, signature, nonce } = req.body as { message: string; signature: string; nonce: string };

    if (!nonce || !take(nonce)) return res.status(401).json({ error: "Missing/expired nonce" });

    const siwe = new SiweMessage(message);
    const domain = (req.headers.origin ? new URL(req.headers.origin as string).host : req.headers.host) || undefined;
    const { success, data } = await siwe.verify({ signature, nonce, domain });
    if (!success) return res.status(401).json({ error: "Invalid SIWE" });

    const token = jwt.sign(
      { sub: data.address.toLowerCase(), addr: data.address },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES, issuer: "polity-auth" }
    );
    res.json({ ok: true, address: data.address, token });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default authRouter
