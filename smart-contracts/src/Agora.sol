// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorSettings} from "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {
    GovernorVotesQuorumFraction
} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

import {IAgora} from "./interfaces/IAgora.sol";
import {ICitizen} from "../src/interfaces/ICitizen.sol";

contract Agora is
    IAgora,
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    ICitizen public citizen;
    Proposal[] private _proposals;
    mapping(uint256 => uint256) private _indexOf; // proposalId => index+1
    mapping(ProposalType => uint256[]) private _idsByType;

    event Proposed(ProposalType kind);
    event Message(string message);

    constructor(IVotes token, address citizen_)
        Governor("Agora")
        GovernorSettings(
            1, // votingDelay (blocks)
            45818, // votingPeriod (blocks)
            1e18 // proposalThreshold (1 token)
        )
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4) // 4% quorum

    {
        citizen = ICitizen(citizen_);
    }

    // ===== your public API =====

    function createCitizen(address newCitizenAddress) external {
        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        // Citizen contract must have `function create(address)`:
        calldatas[0] = abi.encodeWithSignature("create(address)", newCitizenAddress);

        _create(address(citizen), values, calldatas, ProposalType.Immigration);

        emit Proposed(ProposalType.Immigration);
    }

    function proposeIPFSEvent(string calldata cid) external {
        uint256[] memory values = new uint256[](1);
        values[0] = 0; // Should need different amount of ETH

        bytes[] memory calldatas = new bytes[](1);
        // Example: record an approved event in Citizen (adjust to your real ABI)
        // calldatas[0] = abi.encodeCall(
        //     ICitizen.recordApprovedEvent,
        //     (_msgSender(), cid)
        // );
        calldatas[0] = ""; // placeholder so it compiles if you don’t have the function yet

        uint256 proposalId = _create(address(this), values, calldatas, ProposalType.Event);

        emit Proposed(ProposalType.Event);
        emit Message("proposeIPFSEvent finished");
    }

    function proposalsCount() external view returns (uint256) {
        return _proposals.length;
    }

    function proposals(uint256 offset, uint256 limit) external view returns (Proposal[] memory page) {
        uint256 n = _proposals.length;
        if (offset > n) offset = n;

        uint256 to = offset + limit;
        if (to > n) to = n;

        uint256 size = to - offset;
        page = new Proposal[](size);
        for (uint256 i = 0; i < size; i++) {
            page[i] = _proposals[offset + i];
        }
    }

    function hasPassed(address) external pure returns (bool) {
        // TODO: plug in real logic if needed
        return true;
    }

    function quorumFor(uint256 proposalId) public view returns (uint256) {
        uint256 snapshotBlock = proposalSnapshot(proposalId);
        require(block.number > snapshotBlock, "VOTING_NOT_STARTED");
        return quorum(snapshotBlock);
    }

    // ===== required overrides =====

    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function supportsInterface(bytes4 interfaceId) public view override(Governor) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // ===== internal create =====

    function _create(address target, uint256[] memory values, bytes[] memory calldatas, ProposalType proposalType)
        internal
        returns (uint256 id)
    {
        address[] memory targets = new address[](1);
        targets[0] = target;

        if (proposalType == ProposalType.Immigration) {
            require(targets.length > 0 && targets[0] != address(0), "TARGET_REQUIRED");
        }

        // uses Governor.propose + proposalThreshold
        id = super.propose(targets, values, calldatas, "Pure signalling vote");

        uint64 start = uint64(proposalSnapshot(id));
        uint64 end = uint64(proposalDeadline(id));

        _indexOf[id] = _proposals.length + 1;
        _proposals.push(
            Proposal({id: id, kind: proposalType, proposer: _msgSender(), startBlock: start, endBlock: end})
        );

        _idsByType[proposalType].push(id);

        emit Message("_create finished");
    }
}
