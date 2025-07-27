import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "solidity-coverage";
import dotenv from "dotenv";

dotenv.config();

let config: HardhatUserConfig
if(process.env.NODE_ENV === "test") {
   config= {
  solidity: "0.8.24",
};
} else {
 config = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000, // or whatever ms delay you want
      },
    },
  },
};
}

export default config;
