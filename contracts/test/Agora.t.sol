// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IAgora} from "../src/interfaces/IAgora.sol";
import {ICitizen} from "../src/interfaces/ICitizen.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Agora} from "../src/Agora.sol";
import {Citizen} from "../src/Citizen.sol";
import {Vote} from "../src/Vote.sol";
import {Reward} from "../src/Reward.sol";

contract ProposeTest is Test {
    Agora agora;
    Reward reward;
    Vote vote;
    Citizen citizen = new Citizen();
    address public owner = address(this);
    address citizenAddress = address(citizen);
    address public proposer = address(0x1234);
    address admin = address(0xA);
    address tlExecutor = address(0xC);
    TimelockController timelock;

    uint256 minDelay = 2 days;

    event Message(string message);

    function setUp() public {
        vote = new Vote(address(this), 1e18);

        reward = new Reward(address(vote), address(this));
        vote.transfer(address(reward), 1e18); // Move tokens from votes to reward

        vm.prank(owner); // This will be timelock, only timelock can call rewardContributor
        reward.rewardContributor(proposer, 1e18); // The proposer earned from rewardContributor

        vm.prank(proposer);
        vote.delegate(proposer);
        vm.roll(block.number + 1);

        citizen = new Citizen();
        citizen.initialize(owner);

        address[] memory proposers = new address[](1);
        proposers[0] = proposer;

        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new TimelockController(minDelay, proposers, executors, admin);

        vm.prank(owner);
        citizen.transferOwnership(address(timelock));

        agora = new Agora(vote, address(citizen));
    }

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
        assertEq(page[0].proposer, proposer);
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

    // Update
    function testVoteForIncrements() public {
        vm.prank(proposer);
        agora.proposeIPFSEvent("QmDummyCid");

        Agora.Proposal[] memory page = agora.proposals(0, 1);
        uint256 proposalId = page[0].id;
        uint64 startBlock = page[0].startBlock;

        vm.roll(uint256(startBlock) + 1);

        vm.prank(proposer);
        agora.castVote(proposalId, 1);

        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = agora.proposalVotes(proposalId); // Maybe should use this method to get the votes

        assertEq(againstVotes, 0);
        assertEq(forVotes, 1000000000000000000);
        assertEq(abstainVotes, 0);
    }

    function testTimelockRecordsLawInCitizen() public {
        address lawProposer = address(0xD);
        string memory cid = "QmLawCID";

        bytes memory data = abi.encodeCall(Citizen.recordApprovedEvent, (lawProposer, cid));

        address target = address(citizen);
        uint256 value = 0;
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256("law-1");

        // schedule
        vm.prank(proposer);
        timelock.schedule(target, value, data, predecessor, salt, minDelay);

        // wait
        vm.warp(block.timestamp + minDelay + 1);

        // execute
        timelock.execute(target, value, data, predecessor, salt);

        // assert recorded
        bytes32 cidHash = keccak256(bytes(cid));
        (address storedProposer, uint64 approvedAt) = citizen.passedEvents(cidHash);

        assertEq(storedProposer, lawProposer);
        assertGt(approvedAt, 0);
    }

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
