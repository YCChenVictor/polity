// index.tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAddress } from "viem";
import { Buffer } from "buffer";

import wagmiConfig from "./wagmiConfig";

import App from "./App";

window.Buffer = Buffer;

const queryClient = new QueryClient();
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root container not found");
const root = createRoot(rootEl);

function Root() {
  const { isConnected } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();

  const [clickedUid, setClickedUid] = React.useState<string | null>(null); // track which button was pressed
  const [addr, setAddr] = React.useState<`0x${string}` | null>(null);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("citizen");
    const fromStore = localStorage.getItem("citizenAddress");
    const val = (fromUrl ?? fromStore) as `0x${string}` | null;
    if (val && isAddress(val)) setAddr(val);
  }, []);

  React.useEffect(() => {
    if (addr) localStorage.setItem("citizenAddress", addr);
  }, [addr]);

  const valid = isAddress(input as `0x${string}`);

  // Step 1: connect wallet
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <h1 className="text-xl">Connect Wallet</h1>
        <div className="flex flex-col gap-2">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => {
                setClickedUid(c.uid);
                connect({ connector: c });
              }}
              className="px-3 py-2 border rounded"
              disabled={isPending && clickedUid === c.uid}
            >
              {isPending && clickedUid === c.uid
                ? `Connecting with ${c.name}…`
                : `Connect with ${c.name}`}
            </button>
          ))}
        </div>
        <small className="text-red-600">{error?.message ?? ""}</small>
      </div>
    );
  }

  // Step 2: ask for citizen contract
  if (!addr) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-xl">Enter Citizen Contract Address</h1>
        <input
          className="border rounded p-2 w-80"
          placeholder="0x..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && valid && setAddr(input as `0x${string}`)
          }
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => setAddr(input as `0x${string}`)}
            disabled={!valid}
            title={valid ? "" : "Invalid address"}
          >
            Load
          </button>
          <button
            className="px-4 py-2 border rounded"
            onClick={() => {
              localStorage.removeItem("citizenAddress");
              setInput("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  // Step 3: app
  return <App citizenAddress={addr} />;
}

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <Root />
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>,
);
