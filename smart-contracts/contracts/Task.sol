pragma solidity ^0.8.0;

contract TaskManager {
    struct Task {
        uint id;
        string description;
        bool completed;
    }

    Task[] public tasks;

    function helloWorld() public pure returns (string memory) {
        return "Hello, World!";
    }

    function createTask(uint _id, string memory _description) public {
        tasks.push(Task({
            id: _id,
            description: _description,
            completed: false
        }));
    }

    function markTaskCompleted(uint _index) public {
        require(_index < tasks.length, "Task index out of bounds");
        tasks[_index].completed = true;
    }

    function listTasks() public view returns (Task[] memory) {
        Task[] memory taskList = new Task[](tasks.length);

        for (uint i = 0; i < tasks.length; i++) {
            taskList[i] = tasks[i];
        }

        return taskList;
    }
}
