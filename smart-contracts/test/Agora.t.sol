// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IAgora} from "../src/interfaces/IAgora.sol";
import {ICitizen} from "../src/interfaces/ICitizen.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

import {Agora} from "../src/Agora.sol";
import {Citizen} from "../src/Citizen.sol";
import {Vote} from "../src/Vote.sol";

contract ProposeTest is Test {
    Agora agora;
    Citizen citizen = new Citizen();
    address citizenAddress = address(citizen);
    Vote vote;
    address public proposer = address(0x1234);
    address A = address(0xA11CE);
    address B = address(0xB11CE);

    event Message(string message);

    function setUp() public {
        vote = new Vote();
        vote.mint(proposer, 1e18);
        vm.prank(proposer);
        vote.delegate(proposer);

        vm.roll(block.number + 1);

        agora = new Agora();

        bytes memory agoraInitData = abi.encodeCall(Agora.initialize, (IVotes(address(vote)), address(citizen)));

        ERC1967Proxy proxy = new ERC1967Proxy(address(agora), agoraInitData);
        agora = Agora(payable(address(proxy)));

        citizen = new Citizen();
    }

    // Immigrations
    // Create
    function testCreateCitizen() public {
        address newCitizen = address(0xBEEF);

        // call as proposer (the one with voting power)
        vm.prank(proposer);
        agora.createCitizen(newCitizen);

        IAgora.Proposal[] memory page = agora.proposals(0, 100);

        assertEq(page.length, 1);
    }

    function testProposeIPFSEvent() public {
        string memory cid = "bafkreigykb62xhd7gluyfzdv2opzgkbgovtphi2fuyjpdygbilp6rdchsu";

        vm.prank(proposer);
        agora.proposeIPFSEvent(cid);

        Agora.Proposal[] memory page = agora.proposals(0, 100);

        assertEq(page.length, 1);
    }

    function testQuorumFor() public {
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        address[] memory targets = new address[](1);
        targets[0] = address(this);
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeCall(ICitizen.recordApprovedEvent, (address(0x1234), "DUMMY_CID"));

        vm.prank(proposer);
        uint256 id = agora.propose(targets, values, calldatas, "test");
        uint256 snap = agora.proposalSnapshot(id);

        vm.expectRevert(bytes("VOTING_NOT_STARTED"));
        agora.quorumFor(id);

        vm.roll(snap + 1); // vm.roll(n) instantly sets the next block number to n in Forge tests.
        assertEq(agora.quorumFor(id), agora.quorum(snap));
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
