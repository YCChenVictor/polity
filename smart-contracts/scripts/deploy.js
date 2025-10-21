const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const Vote = await ethers.getContractFactory("Vote");
  const vote = await Vote.deploy();
  const Citizen = await ethers.getContractFactory("CitizenRegistry");
  const citizen = await Citizen.deploy();
  const Agora = await ethers.getContractFactory("Agora");
  const agora = await Agora.deploy(await vote.getAddress());
  console.log({ vote: await vote.getAddress(), citizen: await citizen.getAddress(), agora: await agora.getAddress() });
}
main().catch((e)=>{console.error(e);process.exit(1);});
