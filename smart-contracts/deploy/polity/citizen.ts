// npx hardhat run scripts/deploy/polity/citizen.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying CitizenRegistry from:", deployer.address);

  const Citizen = await hre.ethers.getContractFactory("CitizenRegistry");
  const registry = await Citizen.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("CitizenRegistry deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
