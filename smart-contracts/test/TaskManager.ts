import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("TaskManager", function () {
  const mockEthAddress = '0x1234567890abcdef1234567890abcdef12345678';

  // Fixture to deploy the TaskManager contract
  async function deployTaskFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const TaskManager = await hre.ethers.getContractFactory("TaskManager");
    const taskManager = await TaskManager.deploy();
    return { taskManager, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set taskCompleted to false initially", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const backendId = 1
      await taskManager.createTask(backendId, mockEthAddress);
      await taskManager.createTask(backendId, mockEthAddress);
      const task = await taskManager.getTask(backendId);
      expect(task.completed).to.equal(false);
    });
  });

  describe("helloWorld", function () {
    it("Should return 'Hello, World!'", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const result = await taskManager.helloWorld();
      expect(result).to.equal("Hello, World!");
    });
  });

  describe("createTask", function () {
    it("Should create a new task with the given description", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const backendId = 1
      await taskManager.createTask(backendId, mockEthAddress);
      const createdTask = await taskManager.getTask(backendId);
      expect(createdTask.completed).to.equal(false);
    });
  });

  describe("markTaskCompleted", function () {
    it("Should set taskCompleted to true", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const backendId = 1
      await taskManager.createTask(backendId, mockEthAddress);
      await taskManager.markTaskCompleted(backendId);
      const task = await taskManager.getTask(backendId);
      expect(task.completed).to.equal(true);
    });
  });

  describe("listTasks", function () {
    it("should list all tasks", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const backendIdOne = 1
      const backendIdTwo = 2
      const backendIdThree = 3
      await taskManager.createTask(backendIdOne, mockEthAddress);
      await taskManager.createTask(backendIdTwo, mockEthAddress);
      await taskManager.createTask(backendIdThree, mockEthAddress);

      const tasks = await taskManager.listTasks();
      expect(tasks.length).to.equal(3);
      expect(Number(tasks[0][0])).to.equal(1);
      expect(tasks[0][1]).to.equal(false);
    });
  });
});
