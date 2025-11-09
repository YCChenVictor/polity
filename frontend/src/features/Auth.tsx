"use client";

import { useState } from "react";
import { useAccount, useConnect, useSignMessage, useChainId } from "wagmi";
import { SiweMessage } from "siwe";

export default function SiweLoginButton({
  onSuccess,
}: {
  onSuccess?: (s: { address: string }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 1) ensure connected
      let addr = address as `0x${string}` | undefined;
      if (!addr) {
        const connector =
          connectors.find((c) => c.id === "injected" && c.ready) ??
          connectors.find((c) => c.ready) ??
          connectors[0];
        if (!connector) throw new Error("No wallet connector");
        const { accounts } = await connectAsync({ connector });
        addr = accounts?.[0] as `0x${string}` | undefined;
      }
      if (!addr) throw new Error("No address");

      // 2) nonce
      const { nonce } = await (
        await fetch("/api/nonce", { credentials: "include" })
      ).json();

      // 3) build + sign EXACT prepared string
      const siwe = new SiweMessage({
        domain: window.location.host,
        address: addr,
        statement: "Sign in to Polity.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId || 1,
        nonce,
      });
      const message = siwe.prepareMessage();
      const signature = await signMessageAsync({ message });

      // 4) verify -> HttpOnly cookie
      const verify = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      });
      if (!verify.ok) throw new Error("SIWE verify failed");

      // 5) session
      const me = await fetch("/api/me", { credentials: "include" });
      const sess = me.ok ? await me.json() : { address: addr };
      onSuccess?.(sess);
    } catch (e) {
      console.error(e);
      alert(e ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-black text-white rounded-lg"
      disabled={loading || isConnecting}
    >
      {loading || isConnecting
        ? "Signing in..."
        : isConnected
          ? "Sign in with Ethereum"
          : "Connect & Sign in"}
    </button>
  );
}
