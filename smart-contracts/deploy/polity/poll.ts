// npx hardhat run deploy/polity/poll.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Poll from:", deployer.address);

  const poll = await hre.ethers.getContractFactory("Poll");
  const registry = await poll.deploy(51); // At least 51%
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("Poll deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
