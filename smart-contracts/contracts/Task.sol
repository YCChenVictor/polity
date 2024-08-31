pragma solidity ^0.8.0;

contract TaskManager {
    struct Task {
        string description;
        bool completed;
    }

    Task[] public tasks;

    function helloWorld() public pure returns (string memory) {
        return "Hello, World!";
    }

    function createTask(string memory _description) public {
        tasks.push(Task({
            description: _description,
            completed: false
        }));
    }

    function markTaskCompleted(uint _index) public {
        require(_index < tasks.length, "Task index out of bounds");
        tasks[_index].completed = true;
    }

    function listTasks() public view returns (string[][] memory) {
        string[][] memory taskList = new string[][](tasks.length);

        for (uint i = 0; i < tasks.length; i++) {
            taskList[i] = new string[](2);
            taskList[i][0] = tasks[i].description;
            taskList[i][1] = tasks[i].completed ? "true" : "false";
        }

        return taskList;
    }
}
