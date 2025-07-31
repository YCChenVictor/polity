// npx hardhat compile
// npx hardhat run scripts/deploy/uups.ts --network localhost

import hre from "hardhat";

const contractName = "PolityRule1"

async function main() {
  const PolityRule1 = await hre.ethers.getContractFactory(contractName);
  const proxy = await hre.upgrades.deployProxy(PolityRule1, [123], {
    initializer: "initialize",
    kind: "uups"
  });
  console.log("Proxy deployed at:", proxy.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
