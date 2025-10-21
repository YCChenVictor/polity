import "@nomicfoundation/hardhat-ignition";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if(!process.env.DEPLOYER_PRIVATE_KEY) {
  throw "NO DEPLOYER_PRIVATE_KEY"
}
const deployerDeployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY

if(!process.env.SEPOLIA_RPC_URL) {
  throw "NO SEPOLIA_RPC_URL"
}

const config = {
  paths: {
    sources: "contracts",
    tests: "hh-test",
  },
  solidity: {
    version: "0.8.25",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun"
    }
  },
  networks: {
    hardhat: { // local hardhat network
      chainId: 11155111,                 
      type: "edr-simulated",         
      forking: { url: process.env.SEPOLIA_RPC_URL },  
    },
    sepolia: { // sepolia testnet
      type: "http",
      chainId: 11155111,
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [deployerDeployerPrivateKey],
    },
    // mainnet: { // ethereum mainnet
    //   type: "http",
    //   chainId: 1,
    //   url: process.env.MAINNET_RPC_URL || "",
    //   accounts: [deployerDeployerPrivateKey],
    // },
  },
};

export default config;
