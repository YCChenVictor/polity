import { ethers, upgrades } from "hardhat";
import { expect } from "chai";

describe("MyToken Upgrade", function () {
  let proxyAddress: string;

  before(async function () {
    const initialSupply = 1000n * 10n ** 18n;
    const Upgradeable1 = await ethers.getContractFactory("Upgradeable1");
    const proxy = await upgrades.deployProxy(
      Upgradeable1,
      ["MyToken", "MTK", initialSupply],
      { initializer: "initialize" },
    );

    proxyAddress = await proxy.getAddress();
  });

  it("upgrades to V2", async function () {
    const Upgradeable2 = await ethers.getContractFactory("Upgradeable2");
    const upgraded = await upgrades.upgradeProxy(proxyAddress, Upgradeable2);

    const newImplAddress = await upgraded.getAddress();
    expect(newImplAddress).to.equal(proxyAddress);
  });
});
