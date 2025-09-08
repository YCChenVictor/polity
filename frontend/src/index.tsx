import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WagmiProvider } from "wagmi";
import wagmiConfig from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAddress } from "viem";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const queryClient = new QueryClient();
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root container not found");
const root = createRoot(rootEl);

function Root() {
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

  if (!addr) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <h1 className="text-xl">Enter Citizen Contract Address</h1>
        <input
          className="border rounded p-2 w-80"
          placeholder="0x..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
