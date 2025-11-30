import { createConfig, http } from "@wagmi/core";
import { defineChain } from "viem";

const localChain = defineChain({
  id: 31337,
  name: "Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
});

const wagmiConfig = createConfig({
  chains: [localChain],
  transports: {
    [localChain.id]: http("http://127.0.0.1:8545"),
  },
});

export default wagmiConfig;
