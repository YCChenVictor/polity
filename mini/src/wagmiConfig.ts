import { createConfig, http, type Config } from "@wagmi/core";
import { hardhat } from "viem/chains";

const mode = import.meta.env.MODE ?? "development";
const isTest = mode === "test";

const RPC_URL = isTest
  ? "http://127.0.0.1:8546"
  : "http://127.0.0.1:8545";

export const wagmiConfig: Config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(RPC_URL),
  },
} as const);

export default wagmiConfig;
