import { signMessage } from "@wagmi/core";

import wagmiConfig from "./wagmiConfig";
import { base } from "./frontendClients/base"

const login = async () => {
  const account = await base.ensureAccount();
  const address = account.address;
  const chainId = account.chainId;

  if (!address) {
    throw new Error("No wallet address");
  }

  // Make sure it is an address
  // Ask backend for SIWE challenge (no proof yet)
  // It will set a nonce cookie and return a SIWE message containing that nonce
  // Later I'll send { address, message, signature } to /verify; backend will verify SIWE and issue JWT
  const challengeRes = await fetch("/api/auth/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ address, chainId }),
  })

  if (!challengeRes.ok) {
    throw new Error(`HTTP ${challengeRes.status}`);
  }

  const { message } = (await challengeRes.json()) as { message: string };


  // Wallet signs the SIWE message -> this proves “this wallet is really mine right now”
  const signature = await signMessage(wagmiConfig, { message });

  // Send { address, message, signature } to backend
  // Backend will verify SIWE + nonce + domain and then issue JWT/session cookie
  const verifyRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ address, message, signature }),
  });

  if (!verifyRes.ok) {
    const text = await verifyRes.text().catch(() => "");
    throw new Error(text || `HTTP ${verifyRes.status}`);
  }

  return true;
}

export const auth = { login };
