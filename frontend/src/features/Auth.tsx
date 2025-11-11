import { useState } from "react";
import {
  useAccount,
  useConnect,
  useSignMessage,
  useChainId,
  Connector,
} from "wagmi";
import { getAddress, Address } from "viem";

const ensureAddress = async ({
  address,
  connectors,
  connectAsync,
}: {
  address?: Address;
  connectors: readonly Connector[];
  connectAsync: (args: {
    connector: Connector;
    chainId?: number;
  }) => Promise<{ accounts: readonly Address[] }>;
}): Promise<Address> => {
  let addr = address as Address | undefined;

  if (!addr) {
    const connector =
      connectors.find((c) => c.id === "injected" && c.ready) ??
      connectors.find((c) => c.ready);
    if (!connector) throw new Error("No wallet connector");

    const { accounts } = await connectAsync({ connector });
    addr = accounts?.[0] as Address | undefined;
  }

  if (!addr) throw new Error("No address");
  return getAddress(addr); // normalize to checksum
};

export default function SiweLoginButton() {
  const [loading, setLoading] = useState(false);
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();

  const okJson = async (r: Response) => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // ensure connected
      const addr = await ensureAddress({ address, connectors, connectAsync });

      // ask server for challenge (sets httpOnly nonce cookie)
      const { message } = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address: addr, chainId }),
      }).then(okJson);

      // sign
      const signature = await signMessageAsync({ message });

      // verify (server consumes nonce + sets session)
      await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, signature }),
      }).then(okJson);

      // use session
      await fetch("/api/me", { credentials: "include" }).then(okJson);
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
