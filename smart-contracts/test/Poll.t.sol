// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';

import '../../contracts/polity/Poll.sol';

contract ProposeTest is Test {
    Poll poll;
    address A = address(0xA11CE);

    function setUp() public {
        poll = new Poll(51);
        poll.create('hello world'); // ensure proposal id=0 exists
    }

    function testProposeAndList() public {
        // already created in setUp
        Poll.View[] memory views = poll.list();
        assertEq(views.length, 1);
        assertEq(views[0].id, 0);
        assertEq(views[0].content, 'hello world');
        assertEq(views[0].yes, 0);
        assertEq(views[0].no, 0);
    }

    function testYesIncrements() public {
        vm.prank(A);
        poll.vote(0, true);
        assertEq(poll.yesVotes(0), 1);
        assertEq(poll.noVotes(0), 0);
    }

    function testNoIncrements() public {
        vm.prank(A);
        poll.vote(0, false);
        assertEq(poll.noVotes(0), 1);
        assertEq(poll.yesVotes(0), 0);
    }
}
