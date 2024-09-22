pragma solidity ^0.8.0;

contract TaskManager {
    address owner;

    constructor() payable {
        owner = msg.sender;
    }

    struct Task {
        uint backendId;
        bool completed;
        address payable workerAddress;
        uint256 paymentAmount;
    }

    Task[] public tasks;
    mapping(uint256 => uint256) private backendIdToIndex;

    function createTask(uint backendId, address payable workerAddress, uint256 paymentAmount) public {
        tasks.push(Task(backendId, false, workerAddress, paymentAmount));
        uint256 index = tasks.length - 1;
        backendIdToIndex[backendId] = index;
    }

    function markTaskCompleted(uint256 backendId) public {
        uint256 index = backendIdToIndex[backendId];
        require(index < tasks.length, "Task index out of bounds");
        Task storage task = tasks[index];
        require(!task.completed, "Task already completed");
        require(address(this).balance >= task.paymentAmount, "Insufficient contract balance");

        task.completed = true;
        task.workerAddress.transfer(task.paymentAmount); // Transfer ETH to the worker
    }

    function getTask(uint256 backendId) public view returns (Task memory) {
        uint256 index = backendIdToIndex[backendId];
        return tasks[index];
    }

    function listTasks() public view returns (Task[] memory) {
        return tasks;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
