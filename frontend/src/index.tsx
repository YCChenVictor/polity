import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WagmiProvider } from "wagmi";
import wagmiConfig from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}
const root = createRoot(container);

function Root() {
  const [addr, setAddr] = React.useState<`0x${string}` | null>(null);
  const [input, setInput] = React.useState("");

  // load from localStorage (or URL ?citizen=0x..)
  React.useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get("citizen");
    const fromStore = localStorage.getItem("citizenAddress");
    const val = (fromUrl ?? fromStore) as `0x${string}` | null;
    if (val) setAddr(val);
  }, []);

  // persist when set
  React.useEffect(() => {
    if (addr) localStorage.setItem("citizenAddress", addr);
  }, [addr]);

  const valid = /^0x[0-9a-fA-F]{40}$/.test(input);

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
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={() => setAddr(input as `0x${string}`)}
          disabled={!valid}
          title={valid ? "" : "Address must be 42-char 0x..."}
        >
          Load
        </button>
      </div>
    );
  }

  return <App citizenAddress={addr} />;
}

root.render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>
      <Root />
    </WagmiProvider>
  </QueryClientProvider>,
);
