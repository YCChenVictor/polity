import { createConfig, http } from "wagmi";
import { injected } from "@wagmi/connectors";
import { hardhat } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [hardhat],
  transports: { [hardhat.id]: http("http://127.0.0.1:8545") },
  connectors: [injected({ shimDisconnect: true })],
});

export default wagmiConfig;
