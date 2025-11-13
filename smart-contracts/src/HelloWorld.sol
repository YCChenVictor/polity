// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloWorld {
    // Do not expose any function with external and public if do not want to be callable
    // Use require to design who can call it

    string public greeting;

    constructor() {
        greeting = "Hello, Polity!";
    }

    function getGreeting() external view returns (string memory) {
        return greeting;
    }

    function setGreeting(string calldata newGreeting) external {
        greeting = newGreeting;
    }
}
