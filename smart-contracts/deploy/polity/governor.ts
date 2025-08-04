// npx hardhat run deploy/polity/governor.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying GovernorProposalSystem from:", deployer.address);

  const GovernorProposalSystem = await hre.ethers.getContractFactory("GovernorProposalSystem");
  const registry = await GovernorProposalSystem.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("GovernorProposalSystem deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
