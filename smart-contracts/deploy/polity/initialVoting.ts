// npx hardhat run deploy/polity/initialVoting.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying initialVoting from:", deployer.address);

  const InitialVoting = await hre.ethers.getContractFactory("InitialVoting");
  const registry = await InitialVoting.deploy(51); // At least 51%
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("InitialVoting deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
