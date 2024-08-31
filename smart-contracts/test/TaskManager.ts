import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("TaskManager", function () {
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
      await taskManager.createTask("Initial Task");
      const task = await taskManager.tasks(0);
      expect(task.completed).to.equal(false);
    });
  });

  describe("createTask", function () {
    it("Should create a new task with the given description", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      const description = "New Task Description";
      await taskManager.createTask(description);
      const createdTask = await taskManager.tasks(0);
      expect(createdTask.description).to.equal(description);
      expect(createdTask.completed).to.equal(false);
    });
  });

  describe("markTaskCompleted", function () {
    it("Should set taskCompleted to true", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      await taskManager.createTask("Task to be completed");
      await taskManager.markTaskCompleted(0);
      const task = await taskManager.tasks(0);
      expect(task.completed).to.equal(true);
    });
  });

  describe("listTasks", function () {
    it("should list all tasks", async function () {
      const { taskManager } = await loadFixture(deployTaskFixture);
      await taskManager.createTask("Buy groceries");
      await taskManager.createTask("Write report");
      await taskManager.createTask("Exercise");

      const tasks = await taskManager.listTasks();
      expect(tasks.length).to.equal(3);
      expect(tasks[0][0]).to.equal("Buy groceries");
      expect(tasks[0][1]).to.equal("false");
      expect(tasks[1][0]).to.equal("Write report");
      expect(tasks[1][1]).to.equal("false");
      expect(tasks[2][0]).to.equal("Exercise");
      expect(tasks[2][1]).to.equal("false");
    });
  });
});
