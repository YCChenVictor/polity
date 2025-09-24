// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';

import '../../contracts/polity/DeprecableGovernment.sol';
import '../../contracts/polity/Citizen.sol';

contract ProposeTest is Test {
    DeprecableGovernment deprecableGovernment;
    Citizen citizen;
    address A = address(0xA11CE);
    address B = address(0xB11CE);

    function setUp() public {
        citizen = new Citizen();
        deprecableGovernment = new DeprecableGovernment();
        citizen.setDeprecableGovernment(address(deprecableGovernment));
    }

    //// Immigrations
    // Create
    function testCreate() public {
        uint256 id = deprecableGovernment.create(
            DeprecableGovernment.ProposalType.Immigration,
            B,
            100
        );
        assertEq(id, 0);
    }

    // Read
    function testProposeAndList() public {
        deprecableGovernment.create(DeprecableGovernment.ProposalType.Immigration, B, 100);
        DeprecableGovernment.View[] memory views = deprecableGovernment.listImmigrationPolls();
        assertEq(views.length, 1);
    }

    // Update
    function testYesIncrements() public {
        deprecableGovernment.create(DeprecableGovernment.ProposalType.Immigration, B, 100);
        vm.prank(A);
        deprecableGovernment.vote(0, true);
        assertEq(deprecableGovernment.yesVotes(0), 1);
        assertEq(deprecableGovernment.noVotes(0), 0);
    }

    function testNoIncrements() public {
        deprecableGovernment.create(DeprecableGovernment.ProposalType.Immigration, B, 100);
        vm.prank(A);
        deprecableGovernment.vote(0, false);
        assertEq(deprecableGovernment.noVotes(0), 1);
        assertEq(deprecableGovernment.yesVotes(0), 0);
    }

    // Destroy
    function testFinalize() public {
        uint256 id = deprecableGovernment.create(
            DeprecableGovernment.ProposalType.Immigration,
            B,
            1
        );
        deprecableGovernment.vote(0, true);

        vm.warp(block.timestamp + 2 days);

        deprecableGovernment.finalize(id);
    }

    //// Config
    function testCurrentConfig() public {
        deprecableGovernment.create(DeprecableGovernment.ProposalType.Immigration, B, 100);
        (uint16 percent, uint64 votingSeconds) = deprecableGovernment.currentConfig();

        assertEq(percent, 51, 'minVotesPercent mismatch');
        assertEq(votingSeconds, 10, 'votingSeconds mismatch');
    }
}
