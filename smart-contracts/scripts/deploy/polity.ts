// npx hardhat run scripts/deploy/polity.ts --network localhost

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const Polity = await hre.ethers.getContractFactory("PolityGovernment");
  const dao = await Polity.deploy(
    1,                                             
  );
  await dao.waitForDeployment();
  const address = await dao.getAddress();
  console.log("PolityGovernment deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
