import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WagmiProvider } from "wagmi";
import wagmiConfig from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";

const address = process.env.REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`;
if (!address) {
  throw new Error("No REACT_APP_GOVERNMENT_ADDRESS");
}

window.Buffer = Buffer;

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={wagmiConfig}>
      <App address={address} />
    </WagmiProvider>
  </QueryClientProvider>,
);
