import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import wagmiConfig from "./wagmiConfig";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";

const address = process.env.REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`;

window.Buffer = Buffer;

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider>
          <App address={address} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
);
