// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Governor } from '@openzeppelin/contracts/governance/Governor.sol';
import { GovernorSettings } from '@openzeppelin/contracts/governance/extensions/GovernorSettings.sol';
import { GovernorCountingSimple } from '@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol';
import { GovernorVotes } from '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import { GovernorVotesQuorumFraction } from '@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol';
import { IVotes } from '@openzeppelin/contracts/governance/utils/IVotes.sol';
import { IAgora } from './interfaces/IAgora.sol';
import { ICitizen } from './interfaces/ICitizen.sol';

// Agora was the central public space in ancient Greek city-states.
contract Agora is
    IAgora,
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    Proposal[] private _proposals;

    mapping(uint256 => uint256) private _indexOf;
    mapping(uint256 => Proposal) private _details;
    mapping(ProposalType => uint256[]) private _idsByType;

    event Proposed(ProposalType kind);

    constructor(
        IVotes token
    )
        Governor('Poll')
        GovernorSettings(1, 45818, 0) // delay, period, threshold
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4) // 4% quorum (example)
    {}

    function createCitizen(address newCitizenAddress) external {
        uint[] memory values = new uint[](1);
        values[0] = 0; // Should need different amount of ETH
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature('addCitizen(address)', newCitizenAddress);
        _create(values, calldatas, ProposalType.Immigration);
    }

    function createIPFS(address proposer, string calldata cid) external {
        uint[] memory values = new uint[](1);
        values[0] = 0; // Should need different amount of ETH
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeCall(ICitizen.recordApprovedEvent, (proposer, cid));
        _create(values, calldatas, ProposalType.Event);
    }

    function proposals(
        uint256 offset,
        uint256 limit
    ) external view returns (Proposal[] memory page) {
        uint256 n = _proposals.length;
        if (offset > n) offset = n; // clamp offset so we don’t revert

        uint256 to = offset + limit;
        if (to > n) to = n;

        uint256 size = to - offset;
        page = new Proposal[](size);
        for (uint256 i = 0; i < size; i++) {
            page[i] = _proposals[offset + i];
        }
    }

    function hasPassed(address wallet) external view returns (bool) {
        return true;
    }

    // ===== required overrides =====
    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    ) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    // Internal
    function _create(
        uint256[] memory values,
        bytes[] memory calldatas,
        ProposalType proposalType
    ) internal returns (uint256 id) {
        address[] memory targets = new address[](1);
        targets[0] = address(this);

        if (proposalType == ProposalType.Immigration) {
            require(targets.length > 0 && targets[0] != address(0), 'TARGET_REQUIRED');
        }

        id = super.propose(targets, values, calldatas, 'Pure signalling vote');

        uint64 start = uint64(proposalSnapshot(id));
        uint64 end = uint64(proposalDeadline(id));

        _indexOf[id] = _proposals.length + 1;
        _proposals.push(
            Proposal({
                id: id,
                kind: proposalType,
                proposer: _msgSender(),
                startBlock: start,
                endBlock: end
            })
        );

        _idsByType[proposalType].push(id);

        emit Proposed(proposalType);
    }
}
