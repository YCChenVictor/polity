// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

import {IAgora} from "../src/interfaces/IAgora.sol";
import {ICitizen} from "../src/interfaces/ICitizen.sol";

import {Agora} from "../src/Agora.sol";
import {CitizenRegistry} from "../src/CitizenRegistry.sol";
import {Vote} from "../src/Vote.sol";

contract ProposeTest is Test {
    Agora agora;
    CitizenRegistry citizenRegistry = new CitizenRegistry();
    address citizenRegistryAddress = address(citizenRegistry);
    Vote token;
    address A = address(0xA11CE);
    address B = address(0xB11CE);

    function setUp() public {
        token = new Vote();
        agora = new Agora(token);
        // citizen.setPoll(address(poll));
    }

    // Immigrations
    // Create
    function testCreateCitizen() public {
        address newCitizen = address(0x1234);

        agora.createCitizen(newCitizen);

        Agora.Proposal[] memory page = agora.proposals(0, 100);

        assertEq(page.length, 1);
    }

    function testCreateIPFS() public {
        agora.createIPFS(A, "bafkreigykb62xhd7gluyfzdv2opzgkbgovtphi2fuyjpdygbilp6rdchsu");

        Agora.Proposal[] memory page = agora.proposals(0, 100);

        assertEq(page.length, 1);
    }

    function testVotesThresholdOf() public {
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeCall(ICitizen.recordApprovedEvent, (address(0x1234), "DUMMY_CID"));

        uint256 id = agora.propose(targets, values, calldatas, "test");
        uint256 snap = agora.proposalSnapshot(id);

        vm.expectRevert(bytes("Voting not started"));
        agora.votesThresholdOf(id);

        vm.roll(snap + 1); // vm.roll(n) instantly sets the next block number to n in Forge tests.
        assertEq(agora.votesThresholdOf(id), agora.quorum(snap));
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

    // function test_initial_state() public {
    //     assertEq(agora.name(), "Polity Agora");
    //     assertEq(agora.pollCount(), 0);
    //     assertEq(agora.owner(), owner);
    // }

    // function test_onlyOwnerCanUpgrade() public {
    //     // Deploy V2 implementation
    //     implV2 = new AgoraUpgradeableV2();

    //     // Non-owner should NOT be able to upgrade
    //     vm.prank(user);
    //     vm.expectRevert(); // from _authorizeUpgrade -> onlyOwner
    //     AgoraUpgradeableV2(address(agora)).upgradeTo(address(implV2));
    // }

    // function test_upgradeAndKeepState() public {
    //     // Arrange: create a poll via proxy (V1 logic)
    //     vm.prank(user);
    //     agora.create("hello");
    //     assertEq(agora.pollCount(), 1);

    //     // Deploy V2 implementation
    //     implV2 = new AgoraUpgradeableV2();

    //     // Act: owner upgrades proxy to V2
    //     vm.prank(owner);
    //     AgoraUpgradeableV2(address(agora)).upgradeTo(address(implV2));

    //     // Assert: proxy address stays the same
    //     assertEq(address(agora), address(proxy));

    //     // Assert: state is preserved
    //     assertEq(agora.pollCount(), 1);
    //     assertEq(agora.name(), "Polity Agora");

    //     // Assert: new logic is available
    //     string memory v = AgoraUpgradeableV2(address(agora)).version();
    //     assertEq(v, "v2");

    //     // And old functions still work
    //     vm.prank(user);
    //     agora.create("world");
    //     assertEq(agora.pollCount(), 2);
    // }
}
