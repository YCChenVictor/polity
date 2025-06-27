import { createConfig, http } from "wagmi";
import { mock } from "wagmi/connectors";
import { hardhat } from "wagmi/chains";

const TEST_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const config = createConfig({
  chains: [hardhat],
  connectors: [
    mock({
      accounts: [TEST_ACCOUNT],
      features: { reconnect: true },
    }),
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

export default config;
