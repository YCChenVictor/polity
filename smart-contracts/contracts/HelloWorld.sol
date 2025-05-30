// src/HelloWorld.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public greeting = 'Hello, World!';

    function setGreeting(string calldata _greeting) external {
        greeting = _greeting;
    }
}
