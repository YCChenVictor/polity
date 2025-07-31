pragma solidity 0.8.24;

contract TaskManager {
    address private owner;

    constructor() payable {
        owner = msg.sender;
    }

    struct Task {
        uint256 backendId;
        bool completed;
        address payable workerAddress;
        uint256 paymentAmount;
    }

    Task[] public tasks;
    mapping(uint256 => uint256) private backendIdToIndex;

    function createTask(
        uint256 backendId,
        address payable workerAddress,
        uint256 paymentAmount
    ) public {
        tasks.push(Task(backendId, false, workerAddress, paymentAmount));
        uint256 index = tasks.length - 1;
        backendIdToIndex[backendId] = index;
    }

    error TaskIndexOutOfBounds();
    error TaskAlreadyCompleted();
    error InsufficientContractBalance();
    function markTaskCompleted(uint256 backendId) public {
        uint256 index = backendIdToIndex[backendId];
        if (index >= tasks.length) {
            revert TaskIndexOutOfBounds();
        }
        Task storage task = tasks[index];
        if (task.completed) {
            revert TaskAlreadyCompleted();
        }
        if (address(this).balance < task.paymentAmount) {
            revert InsufficientContractBalance();
        }

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
