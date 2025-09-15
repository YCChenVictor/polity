// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPoll {
    enum ProposalType {
        Text,
        Target
    }
    function create(
        ProposalType ptype,
        address target,
        uint96 totalCitizens
    ) external returns (uint256 id);
    function hasPassed(address wallet) external view returns (bool);
}

contract Citizen {
    struct CitizenInfo {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }
    address public pollAddress;
    IPoll public pollMechanism;
    address public bootstrapOwner = msg.sender;

    mapping(address => CitizenInfo) public citizens;
    address[] public citizenList;
    uint96 private _count;
    uint256 public nextCitizenId = 1;
    mapping(uint8 => string) public reasonMap;

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
        require(pollAddress != address(0), 'PM_NOT_SET');
        pollMechanism.create(IPoll.ProposalType.Target, target, _count);
        emit ProposalMade(msg.sender, target, _count);
    }

    function createFromPoll(address wallet) external {
        if (msg.sender != pollAddress) revert OnlyPoll();
        require(pollMechanism.hasPassed(wallet), 'POLL_NOT_PASSED');
        _create(wallet, 2);
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

    // Polls
    function setPoll(address _poll) external {
        require(_poll != address(0), 'ZERO');

        if (pollAddress == address(0)) {
            require(msg.sender == bootstrapOwner, 'BOOTSTRAP_ONLY');
        } else {
            require(msg.sender == pollAddress, 'PM_ONLY');
        }

        address old = pollAddress;
        pollAddress = _poll;
        pollMechanism = IPoll(_poll);
        emit PollSet(old, _poll);

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
}
