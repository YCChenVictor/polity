import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import config from "./config";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
