// test/HelloWorld.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '../../contracts/HelloWorld.sol';
import 'forge-std/Test.sol';

contract HelloWorldTest is Test {
    HelloWorld public hello;

    function setUp() public {
        hello = new HelloWorld();
    }

    function testInitialGreeting() public {
        assertEq(hello.greeting(), 'Hello, World!');
    }

    function testSetGreeting() public {
        hello.setGreeting('Hi');
        assertEq(hello.greeting(), 'Hi');
    }
}
