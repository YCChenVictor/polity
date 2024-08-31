pragma solidity ^0.8.0;

contract TaskManager {
    struct Task {
        string description;
        bool completed;
    }

    Task[] public tasks;

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
}
