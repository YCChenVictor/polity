import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WagmiProvider } from "wagmi";
import wagmiConfig from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";

const governmentAddress = process.env
  .REACT_APP_GOVERNMENT_ADDRESS as `0x${string}`;
const userAddress = process.env.REACT_APP_GOVERNOR_ADDRESS as `0x${string}`;
if (!governmentAddress) {
  throw new Error("No REACT_APP_GOVERNMENT_ADDRESS");
}
if (!userAddress) {
  throw new Error("No REACT_APP_GOVERNOR_ADDRESS");
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
      <App {...{ userAddress, governmentAddress }} />
    </WagmiProvider>
  </QueryClientProvider>,
);
