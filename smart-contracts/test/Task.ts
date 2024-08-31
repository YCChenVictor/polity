import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("Task", function () {
    // Fixture to deploy the Task contract
    async function deployTaskFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
      const Task = await hre.ethers.getContractFactory("Task");
      const task = await Task.deploy();
      return { task, owner, otherAccount };
    }
  
    describe("Deployment", function () {
      it("Should set taskCompleted to false initially", async function () {
        const { task } = await loadFixture(deployTaskFixture);
        expect(await task.taskCompleted()).to.equal(false);
      });
    });
  
    describe("markTaskCompleted", function () {
      it("Should set taskCompleted to true", async function () {
        const { task } = await loadFixture(deployTaskFixture);
        await task.markTaskCompleted();
        expect(await task.taskCompleted()).to.equal(true);
      });
    });
  });