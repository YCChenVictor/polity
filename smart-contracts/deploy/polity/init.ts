// deploy/polity/init.ts
// npx hardhat run deploy/polity/init.ts --network localhost

import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const Citizens = await hre.ethers.getContractFactory("Citizen");
  const citizens = await Citizens.deploy();
  await citizens.waitForDeployment();
  const citizensAddress = await citizens.getAddress()
  console.log("Citizens deployed at:", citizensAddress);

  const Poll = await hre.ethers.getContractFactory("Poll");
  const poll = await Poll.deploy(51);
  await poll.waitForDeployment();
  const pollAddress = await poll.getAddress()
  console.log("Poll deployed at:", pollAddress);

  const Polity = await hre.ethers.getContractFactory("Government");
  const government = await Polity.deploy(
    citizensAddress,
    pollAddress
  );
  await government.waitForDeployment();
  console.log("PolityGovernment deployed at:", await government.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
