import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { WagmiConfig, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [hardhat],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
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
