// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {GovernorUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import {
    GovernorSettingsUpgradeable
} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import {
    GovernorCountingSimpleUpgradeable
} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import {
    GovernorVotesUpgradeable
} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import {
    GovernorVotesQuorumFractionUpgradeable
} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";

import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {IAgora} from "./interfaces/IAgora.sol";
import {ICitizen} from "../src/interfaces/ICitizen.sol";

contract Agora is
    Initializable,
    UUPSUpgradeable,
    IAgora,
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    OwnableUpgradeable
{
    ICitizen public citizen;
    Proposal[] private _proposals;
    mapping(uint256 => uint256) private _indexOf;
    mapping(ProposalType => uint256[]) private _idsByType;

    event Proposed(ProposalType kind);
    event IPFSEventProposed(uint256 indexed proposalId, string cid);
    event Message(string message);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IVotes token, address citizen_) public initializer {
        __Governor_init("Agora");
        __GovernorSettings_init(
            1, // votingDelay (blocks)
            45818, // votingPeriod (blocks)
            1e18 // proposalThreshold (1 token)
        );
        __GovernorCountingSimple_init();
        __GovernorVotes_init(token);
        __GovernorVotesQuorumFraction_init(4);
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        citizen = ICitizen(citizen_);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // ===== your functions (unchanged) =====
    function createCitizen(address newCitizenAddress) external {
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("create(address)", newCitizenAddress);
        _create(address(citizen), values, calldatas, ProposalType.Immigration);
    }

    function proposeIPFSEvent(string calldata cid) external {
        uint256[] memory values = new uint256[](1);
        values[0] = 0; // Should need different amount of ETH
        bytes[] memory calldatas = new bytes[](1);
        // calldatas[0] = abi.encodeCall(ICitizen.recordApprovedEvent, (proposer, cid));
        uint256 proposalId = _create(address(this), values, calldatas, ProposalType.Event);
        emit IPFSEventProposed(proposalId, cid);
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
        return true;
    }

    function quorumFor(uint256 proposalId) public view returns (uint256) {
        uint256 snapshotBlock = proposalSnapshot(proposalId);
        require(block.number > snapshotBlock, "VOTING_NOT_STARTED");
        return quorum(snapshotBlock);
    }

    // ===== required overrides =====

    function votingDelay() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(GovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function supportsInterface(bytes4 interfaceId) public view override(GovernorUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // ===== internal create, same as you had but on *Upgradeable* base =====
    function _create(address target, uint256[] memory values, bytes[] memory calldatas, ProposalType proposalType)
        internal
        returns (uint256 id)
    {
        address[] memory targets = new address[](1);
        targets[0] = target;

        if (proposalType == ProposalType.Immigration) {
            require(targets.length > 0 && targets[0] != address(0), "TARGET_REQUIRED");
        }

        // OZ restricts who can successfully call this via proposalThreshold inside Governor.propose, based on the caller’s voting power snapshot.
        id = super.propose(targets, values, calldatas, "Pure signalling vote");

        uint64 start = uint64(proposalSnapshot(id));
        uint64 end = uint64(proposalDeadline(id));

        _indexOf[id] = _proposals.length + 1;
        _proposals.push(
            Proposal({id: id, kind: proposalType, proposer: _msgSender(), startBlock: start, endBlock: end})
        );

        _idsByType[proposalType].push(id);
        emit Proposed(proposalType);
    }
}
