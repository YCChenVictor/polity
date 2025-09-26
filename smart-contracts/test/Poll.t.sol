// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';

import { Poll } from '../contracts/polity/Poll.sol';
import { Citizen } from '../contracts/polity/Citizen.sol';

contract ProposeTest is Test {
    Poll poll;
    Citizen citizen;
    address A = address(0xA11CE);
    address B = address(0xB11CE);

    function setUp() public {
        citizen = new Citizen();
        poll = new Poll(address(citizen), 51, 10);
        citizen.setPoll(address(poll));
    }

    //// Immigrations
    // Create
    function testCreate() public {
        uint256 id = poll.create(Poll.ProposalType.Immigration, B, 100);
        assertEq(id, 0);
    }

    // Read
    function testProposeAndList() public {
        poll.create(Poll.ProposalType.Immigration, B, 100);
        Poll.View[] memory views = poll.listImmigrationPolls();
        assertEq(views.length, 1);
    }

    // Update
    function testYesIncrements() public {
        poll.create(Poll.ProposalType.Immigration, B, 100);
        vm.prank(A);
        poll.vote(0, true);
        assertEq(poll.yesVotes(0), 1);
        assertEq(poll.noVotes(0), 0);
    }

    function testNoIncrements() public {
        poll.create(Poll.ProposalType.Immigration, B, 100);
        vm.prank(A);
        poll.vote(0, false);
        assertEq(poll.noVotes(0), 1);
        assertEq(poll.yesVotes(0), 0);
    }

    // Destroy
    function testFinalize() public {
        uint256 id = poll.create(Poll.ProposalType.Immigration, B, 1);
        poll.vote(0, true);

        vm.warp(block.timestamp + 2 days);

        poll.finalize(id);
    }

    //// Config
    function testCurrentConfig() public {
        poll.create(Poll.ProposalType.Immigration, B, 100);
        (uint16 percent, uint64 votingSeconds) = poll.currentConfig();

        assertEq(percent, 51, 'minVotesPercent mismatch');
        assertEq(votingSeconds, 10, 'votingSeconds mismatch');
    }
}
