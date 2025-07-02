import { createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { injected } from "@wagmi/connectors";

const hardhat1337 = defineChain({
  id: 1337,
  name: "Local 8545",
  network: "hardhat-local",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
} as const);

const wagmiConfig = createConfig({
  chains: [hardhat1337],
  transports: {
    [hardhat1337.id]: http("http://127.0.0.1:8545"),
  },
  connectors: [injected()],
});

export default wagmiConfig;
