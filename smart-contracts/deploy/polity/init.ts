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
  const poll = await Poll.deploy(51, citizensAddress);
  await poll.waitForDeployment();
  const pollAddress = await poll.getAddress()
  console.log("Poll deployed at:", pollAddress);

  // Seems like we do not need government
  // const Polity = await hre.ethers.getContractFactory("Government");
  // const government = await Polity.deploy(
  //   citizensAddress,
  // );
  // await government.waitForDeployment();
  // const governmentAddress = await government.getAddress()
  // console.log("PolityGovernment deployed at:", await government.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
