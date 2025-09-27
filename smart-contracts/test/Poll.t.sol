// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// import 'forge-std/Test.sol';

import 'forge-std/Test.sol';
import { Poll } from '../contracts/polity/Poll.sol';
import { Citizen } from '../contracts/polity/Citizen.sol';
import { Vote } from '../contracts/polity/Vote.sol';

contract ProposeTest is Test {
    Poll poll;
    Citizen citizen = new Citizen();
    address citizenAddr = address(citizen);
    Vote token;
    // address A = address(0xA11CE);
    address B = address(0xB11CE);

    function setUp() public {
        token = new Vote();
        poll = new Poll(token);
        // citizen.setPoll(address(poll));
    }

    // Immigrations
    // Create
    function testCreate() public {
        // This is a crazy array format that need to be followed
        address[] memory targets = new address[](1);
        targets[0] = citizenAddr;
        uint[] memory values = new uint[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature('addCitizen(address)', address(citizen));

        vm.expectEmit(true, true, true, true);
        emit Poll.Proposed(Poll.ProposalType.Immigration);
        poll.create(targets, values, calldatas, Poll.ProposalType.Immigration);
    }

    // Read
    // function testProposeAndList() public {
    //     poll.create(Poll.ProposalType.Immigration, B);
    //     Poll.View[] memory views = poll.listImmigrationPolls();
    //     assertEq(views.length, 1);
    // }

    // Update
    // function testYesIncrements() public {
    //     poll.create(Poll.ProposalType.Immigration, B);
    //     vm.prank(A);
    //     poll.vote(0, true);
    //     assertEq(poll.yesVotes(0), 1);
    //     assertEq(poll.noVotes(0), 0);
    // }

    // function testNoIncrements() public {
    //     poll.create(Poll.ProposalType.Immigration, B);
    //     vm.prank(A);
    //     poll.vote(0, false);
    //     assertEq(poll.noVotes(0), 1);
    //     assertEq(poll.yesVotes(0), 0);
    // }

    // Destroy
    // function testFinalize() public {
    //     uint256 id = poll.create(Poll.ProposalType.Immigration, B);
    //     poll.vote(0, true);

    //     vm.warp(block.timestamp + 2 days);

    //     poll.finalize(id);
    // }

    //// Config
    // function testCurrentConfig() public {
    //     poll.create(Poll.ProposalType.Immigration, B);
    //     (uint16 percent, uint64 votingSeconds) = poll.currentConfig();

    //     assertEq(percent, 51, 'minVotesPercent mismatch');
    //     assertEq(votingSeconds, 10, 'votingSeconds mismatch');
    // }
}
