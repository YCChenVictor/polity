// npx hardhat run deploy/polity/citizen.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Citizen from:", deployer.address);

  const Citizen = await hre.ethers.getContractFactory("Citizen");
  const registry = await Citizen.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("Citizen deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
