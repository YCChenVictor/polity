// index.tsx
// http://localhost:3000/
import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, useAccount, useConnect, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAddress, getAddress } from "viem";
import { Buffer } from "buffer";

import wagmiConfig from "./wagmiConfig";

import App from "./App";

window.Buffer = Buffer;

const queryClient = new QueryClient();
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root container not found");
const root = createRoot(rootEl);

function Root() {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectors, connectAsync, error, isPending } = useConnect();
  const [citizenAddress, setCitizenAddress] = React.useState<
    `0x${string}` | null
  >(null);
  const [input, setInput] = React.useState("");

  // Load from URL param once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const raw = url.searchParams.get("citizen")?.trim();
    if (raw && isAddress(raw)) {
      setCitizenAddress(raw);
    }
  }, []);

  // When you set a new address, also update the URL param
  const handleSetAddress = React.useCallback((addr: `0x${string}`) => {
    setCitizenAddress(addr);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("citizen", addr);
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const valid = isAddress(input.trim());

  const handleDisconnect = async () => {
    await disconnectAsync(); // clears wagmi cached connector/address
    try {
      await window.ethereum?.request?.({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch {
      /* ignore */
    }
  };

  const disconnectButton = (
    <button
      onClick={handleDisconnect}
      className="px-3 py-1 border rounded text-sm"
    >
      Disconnect
    </button>
  );

  // Step 1: connect wallet
  if (!address) {
    return (
      <div className="flex gap-2">
        {connectors.map((c) => (
          <button
            key={c.uid ?? c.id}
            onClick={() => connectAsync({ connector: c })}
            disabled={isPending}
            className="px-3 py-2 border rounded"
          >
            {isPending ? "Connecting…" : `Connect with ${c.name}`}
          </button>
        ))}
        {error && <small className="text-red-600">{error.message}</small>}
      </div>
    );
  }

  // Step 2: ask for citizen contract
  if (!citizenAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        {disconnectButton}
        <h1 className="text-xl">Enter Citizen Contract Address</h1>
        <input
          className="border rounded p-2 w-80"
          placeholder="0x..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid)
              handleSetAddress(getAddress(input.trim()) as `0x${string}`);
          }}
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() =>
              handleSetAddress(getAddress(input.trim()) as `0x${string}`)
            }
            disabled={!valid}
            title={valid ? "" : "Invalid address"}
          >
            Load
          </button>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => {
              setInput("");
              setCitizenAddress(null);
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("citizen");
                window.history.replaceState({}, "", url.toString());
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // Step 3: app
  return (
    <>
      {disconnectButton}
      <App citizenAddress={citizenAddress} />
    </>
  );
}

root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </WagmiProvider>,
);
