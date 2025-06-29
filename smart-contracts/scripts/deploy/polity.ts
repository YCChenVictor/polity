// scripts/deployPolityGov.js
// npx hardhat run scripts/deploy/polity.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const Polity = await hre.ethers.getContractFactory("PolityGovernment");
  const dao = await Polity.deploy(
    [deployer.address],               
    1,                                             
    "0x0000000000000000000000000000000000000000"   
  );

  // wait for the deployment to be mined
  await dao.waitForDeployment();

  // fetch the address
  const address = await dao.getAddress();
  console.log("PolityGovernment deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
