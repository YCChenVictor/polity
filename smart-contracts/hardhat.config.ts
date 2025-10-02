import type { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if(!process.env.DEPLOYER_PRIVATE_KEY) {
  throw "NO DEPLOYER_PRIVATE_KEY"
}
const deployerDeployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [deployerDeployerPrivateKey],
    },
  },
};

export default config;
