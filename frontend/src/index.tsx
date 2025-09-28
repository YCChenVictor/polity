// index.tsx
// http://localhost:3000/
import React from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, useAccount, useConnect, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";

import { CitizenAddressProvider } from "./CitizenAddressContext";
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

  // Step 2: app
  return (
    <>
      {disconnectButton}
      <CitizenAddressProvider>
        <App />
      </CitizenAddressProvider>
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
