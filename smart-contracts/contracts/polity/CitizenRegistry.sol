// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IAgora } from './interfaces/IAgora.sol';

contract CitizenRegistry {
    address public agoraAddress;
    address public bootstrapOwner = msg.sender;

    IAgora public agora;

    struct CitizenInfo {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }
    struct EventMeta {
        address proposer;
        uint64 executedAt;
    }

    mapping(address => CitizenInfo) public citizens;
    address[] public citizenList;
    uint96 private _count;
    uint256 public nextCitizenId = 1;
    mapping(uint8 => string) public reasonMap;

    mapping(bytes32 => EventMeta) public passedEvents;

    event CitizenCreated(address wallet, uint8 reasonCode);
    event ProposalMade(address indexed proposer, address indexed target, uint256 totalCitizens);
    event PollSet(address indexed oldPoll, address indexed newPoll);

    error OnlyPoll();

    constructor() {
        reasonMap[1] = 'born';
        reasonMap[2] = 'immigrate';
        _create(msg.sender, 1); // deployer becomes citizen
    }

    // Citizens
    function propose(address target) external {
        require(isCitizen(msg.sender), 'NOT_CITIZEN');

        agora.createCitizen(target);
        emit ProposalMade(msg.sender, target, _count);
    }

    // function proposals(
    //     uint256 offset,
    //     uint256 limit
    // ) external view returns (IAgora.Proposal[] memory) {
    //     return agora.proposals(IAgora.ProposalType.Immigration, offset, limit);
    // }

    function createFromPoll(address target) external {
        if (msg.sender != agoraAddress) revert OnlyPoll();
        require(agora.hasPassed(target), 'POLL_NOT_PASSED');
        _create(target, 2);
    }

    function read() external view returns (CitizenInfo[] memory list) {
        list = new CitizenInfo[](citizenList.length);
        for (uint i = 0; i < citizenList.length; i++) list[i] = citizens[citizenList[i]];
    }

    function total() external view returns (uint96) {
        return _count;
    }

    function isCitizen(address a) public view returns (bool) {
        return citizens[a].wallet != address(0);
    }

    function setAgora(address _agora) external {
        require(_agora != address(0), 'ZERO');

        if (agoraAddress == address(0)) {
            require(msg.sender == bootstrapOwner, 'BOOTSTRAP_ONLY');
        } else {
            require(msg.sender == agoraAddress, 'PM_ONLY');
        }

        address old = agoraAddress;
        agoraAddress = _agora;
        agora = IAgora(_agora);
        emit PollSet(old, _agora);

        if (bootstrapOwner != address(0)) {
            bootstrapOwner = address(0);
        }
    }

    function _create(address wallet, uint8 reasonCode) internal {
        require(wallet != address(0), 'ZERO_WALLET');
        require(citizens[wallet].wallet == address(0), 'ALREADY_EXISTS');
        require(bytes(reasonMap[reasonCode]).length > 0, 'BAD_REASON');
        citizens[wallet] = CitizenInfo(nextCitizenId++, wallet, reasonCode);
        citizenList.push(wallet);
        _count++;
        emit CitizenCreated(wallet, reasonCode);
    }

    // Rules for all citizens
    function recordApprovedEvent(address proposer, string calldata cid) external {
        bytes32 cidHash = keccak256(bytes(cid));
        passedEvents[cidHash] = EventMeta(proposer, uint64(block.timestamp));
    }
}
