pragma solidity ^0.8.0;

contract Task {
    bool public taskCompleted = false;

    function markTaskCompleted() public {
        taskCompleted = true;
    }
}
