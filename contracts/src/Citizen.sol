// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {IAgora} from "./interfaces/IAgora.sol";

// The citizen is owned by timelock. Later timelock can trigger events when votes passed.
contract Citizen is Initializable, UUPSUpgradeable, OwnableUpgradeable {
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

    mapping(address => bool) public isCitizen;

    event CitizenAdded(address indexed citizen);
    event CitizenRemoved(address indexed citizen);
    event ProposalMade(address indexed proposer, address indexed target, uint256 totalCitizens);
    event PollSet(address indexed oldPoll, address indexed newPoll);

    error OnlyPoll();
    error AlreadySet();
    error ZeroAddress();
    error NoChange();
    error NotContract();
    error BootstrapOnly();
    error AgoraOnly();

    // In UUPS upgradeable contracts, the constructor never runs on the proxy, so you set things up in a public initialize() function that’s allowed to be called only once.
    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function create(address who) external onlyOwner {
        require(who != address(0), "ZERO_ADDRESS");
        require(!isCitizen[who], "Already exists");
        isCitizen[who] = true;
        citizenList.push(who);
        emit CitizenAdded(who);
    }

    function read() external view returns (address[] memory) {
        return citizenList;
    }

    function total() external view returns (uint96) {
        return _count;
    }

    function recordApprovedEvent(address proposer, string calldata cid) external {
        bytes32 cidHash = keccak256(bytes(cid));
        passedEvents[cidHash] = EventMeta(proposer, uint64(block.timestamp));
    }
}
