// api/nonce.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateNonce } from "siwe";
import { serialize } from "cookie";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const nonce = generateNonce();
  res.setHeader(
    "Set-Cookie",
    serialize("siwe-nonce", nonce, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 300,
      secure: process.env.NODE_ENV === "production", // ← critical for localhost
    }),
  );
  res.status(200).json({ nonce });
}
