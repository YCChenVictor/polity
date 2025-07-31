import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';
import { ethers } from 'ethers';

describe('TaskManager', function () {
    const mockPaymentAmount = 1;

    // Fixture to deploy the TaskManager contract
    async function deployTaskFixture() {
        const TaskManager = await hre.ethers.getContractFactory('TaskManager');
        const taskManager = await TaskManager.deploy({
            value: ethers.parseEther('5.0'),
        }); // Deploy with 5 ETH in contract

        const [owner, worker] = await hre.ethers.getSigners();

        return { taskManager, owner, worker };
    }

    describe('Deployment', function () {
        it('Should set taskCompleted to false initially', async function () {
            const { taskManager, worker } = await loadFixture(deployTaskFixture);
            const backendId = 1;
            await taskManager.createTask(backendId, worker.address, mockPaymentAmount);
            await taskManager.createTask(backendId, worker.address, mockPaymentAmount);
            const task = await taskManager.getTask(backendId);
            expect(task.completed).to.equal(false);
        });
    });

    describe('createTask', function () {
        it('Should create a new task with the given description', async function () {
            const { taskManager, worker } = await loadFixture(deployTaskFixture);
            const backendId = 1;
            await taskManager.createTask(backendId, worker.address, mockPaymentAmount);
            const createdTask = await taskManager.getTask(backendId);
            expect(createdTask.completed).to.equal(false);
        });
    });

    describe('markTaskCompleted', function () {
        it('should mark task as completed and transfer Ether to worker', async function () {
            const { taskManager, owner, worker } = await loadFixture(deployTaskFixture);

            const backendId = 1;

            // Create task with payment
            await taskManager
                .connect(owner)
                .createTask(backendId, await worker.getAddress(), mockPaymentAmount);

            // Capture worker's balance before task completion
            const workerBalanceBefore = await hre.ethers.provider.getBalance(worker.getAddress());

            // Mark task as completed and transfer Ether to worker
            const tx = await taskManager.connect(owner).markTaskCompleted(backendId);
            await tx.wait(); // Wait for the transaction to be mined

            // Check if task is marked as completed
            const task = await taskManager.tasks(0);
            expect(task.completed).to.equal(true);

            // Capture worker's balance after task completion
            const workerBalanceAfter = await hre.ethers.provider.getBalance(worker.getAddress());

            // Check that worker's balance has increased by the paymentAmount
            expect(workerBalanceAfter).to.equal(workerBalanceBefore + BigInt(mockPaymentAmount));

            // Log worker's final balance (optional)
            console.log("Worker's balance after payment:", workerBalanceAfter.toString());
        });
    });

    describe('listTasks', function () {
        it('should list all tasks', async function () {
            const { taskManager, worker } = await loadFixture(deployTaskFixture);
            const backendIdOne = 1;
            const backendIdTwo = 2;
            const backendIdThree = 3;
            await taskManager.createTask(backendIdOne, worker.address, mockPaymentAmount);
            await taskManager.createTask(backendIdTwo, worker.address, mockPaymentAmount);
            await taskManager.createTask(backendIdThree, worker.address, mockPaymentAmount);

            const tasks = await taskManager.listTasks();
            expect(tasks.length).to.equal(3);
            expect(Number(tasks[0][0])).to.equal(1);
            expect(tasks[0][1]).to.equal(false);
        });
    });
});
