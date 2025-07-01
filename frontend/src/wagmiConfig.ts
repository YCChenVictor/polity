import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";
import { http } from "wagmi";

const projectId = process.env.REACT_APP_PROJECT_ID;

if (!projectId) {
  throw "No project id";
}

const wagmiConfig = getDefaultConfig({
  appName: "Local App",
  projectId: projectId,
  chains: [hardhat],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

export default wagmiConfig;
