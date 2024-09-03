pragma solidity ^0.8.0;

contract TaskManager {
    struct Task {
        uint backendId;
        bool completed;
    }

    Task[] public tasks;
    mapping(uint256 => uint256) private backendIdToIndex;

    function helloWorld() public pure returns (string memory) {
        return "Hello, World!";
    }

    function createTask(uint backendId) public {
        // You need to find a good way to store backend id and the index of this array (like a mapping)
        // The input is the backend id and you also update the mapping
        // In getTask -> input backend id -> mapping -> get index -> return tasks[index]
        tasks.push(Task(backendId, false));
        uint256 index = tasks.length - 1;
        backendIdToIndex[backendId] = index;
    }

    function markTaskCompleted(uint256 backendId) public {
        uint256 index = backendIdToIndex[backendId];
        require(index < tasks.length, "Task index out of bounds");
        tasks[index].completed = true;
    }

    function getTask(uint256 backendId) public view returns (Task memory) {
        uint256 index = backendIdToIndex[backendId];
        return tasks[index];
    }

    function listTasks() public view returns (Task[] memory) {
        return tasks;
    }
}
