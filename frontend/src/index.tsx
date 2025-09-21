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
const SESSION_KEY = "polity:sessionConnected";

function Root() {
  const { isConnected, connector: active } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectors, connectAsync, error, isPending } = useConnect();
  const [sessionConnected, setSessionConnected] = React.useState(false);
  const [citizenAddress, setCitizenAddress] = React.useState<
    `0x${string}` | null
  >(null);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1" && isConnected) {
      setSessionConnected(true);
    }
  }, [isConnected]);

  // Load from URL param once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const raw = url.searchParams.get("citizen")?.trim();
    if (raw && isAddress(raw)) {
      setCitizenAddress(raw);
    }
  }, []);

  const markSession = (on: boolean) => {
    setSessionConnected(on);
    if (on) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  };

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

  // Step 1: connect wallet
  if (!sessionConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <h1 className="text-xl">Connect Wallet</h1>
        <div className="flex flex-col gap-2">
          {connectors.map((c) => (
            <button
              key={c.uid}
              className="px-3 py-2 border rounded disabled:opacity-50"
              disabled={isPending}
              onClick={async () => {
                try {
                  // already on this connector → continue
                  if (active && active.id === c.id) {
                    markSession(true);
                    return;
                  }
                  if (active && active.id !== c.id)
                    await disconnectAsync().catch(() => {
                      "";
                    });
                  await connectAsync({ connector: c });
                  markSession(true);
                } catch (e) {
                  const msg = String(e);
                  if (msg.includes("already connected")) {
                    markSession(true);
                    return;
                  }
                }
              }}
            >
              {isPending ? "Connecting…" : `Connect with ${c.name}`}
            </button>
          ))}
        </div>
        {error && <small className="text-red-600">{error.message}</small>}
      </div>
    );
  }

  // Step 2: ask for citizen contract
  if (!citizenAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
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
  return <App citizenAddress={citizenAddress} />;
}

root.render(
  <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </WagmiProvider>,
);
