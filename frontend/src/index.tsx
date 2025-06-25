import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { WagmiConfig, createConfig, http } from "wagmi";
import { mock } from "wagmi/connectors";
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TEST_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const config = createConfig({
  chains: [hardhat], // ← multichain support
  connectors: [
    mock({
      accounts: [TEST_ACCOUNT], // mock uses this address as `useAccount().address`
      features: { reconnect: true }, // auto-connect on mount
    }),
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"), // ← map chainId to RPC URL
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing");

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
