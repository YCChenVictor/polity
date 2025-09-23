// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ITimelock {
    function propose() external returns (uint256);
}

interface IDeprecableGovernment {
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
    error OnlyTimelock();
    error NotCitizen();

    struct CitizenInfo {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }
    address public bootstrapOwner = msg.sender;

    IDeprecableGovernment public deprecableGovernment;
    address public deprecableGovernmentAddress;

    ITimelock public immutable timelock;
    address public timelockAddress;

    mapping(address => CitizenInfo) public citizens;
    address[] public citizenList;
    uint96 private _count;
    uint256 public nextCitizenId = 1;
    mapping(uint8 => string) public reasonMap;

    event CitizenCreated(address wallet, uint8 reasonCode);
    event ProposalMade(address indexed proposer, address indexed target, uint256 totalCitizens);
    event PollSet(address indexed oldPoll, address indexed newPoll);

    error OnlyPoll();

    constructor(address _timelock) {
        timelock = ITimelock(_timelock);
        reasonMap[1] = 'born';
        reasonMap[2] = 'immigrate';
        _create(msg.sender, 1); // deployer becomes citizen
    }

    // Citizens
    function propose(address target) external {
        require(isCitizen(msg.sender), 'NOT_CITIZEN');
        require(deprecableGovernmentAddress != address(0), 'Deprecable Government NOT SET');
        deprecableGovernment.create(IDeprecableGovernment.ProposalType.Target, target, _count);
        emit ProposalMade(msg.sender, target, _count);
    }

    // Deprecable Government
    function proposeGovernment(address newGov) external returns (uint256 proposalId) {
        if (!isCitizen(msg.sender)) revert NotCitizen();
        proposalId = timelock.propose();
    }

    function createFromDeprecableGovernment(address wallet) external {
        require(msg.sender == timelockAddress, 'OnlyTimelock');
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

    // Deprecable Government
    function setDeprecableGovernment(address _newDeprecableGovernment) external {
        if (msg.sender != timelockAddress) revert OnlyTimelock();
        deprecableGovernmentAddress = _newDeprecableGovernment;
    }

    function _create(address wallet, uint8 reasonCode) internal {
        require(msg.sender == deprecableGovernmentAddress, 'OnlyTimelock');
        require(wallet != address(0), 'ZERO_WALLET');
        require(citizens[wallet].wallet == address(0), 'ALREADY_EXISTS');
        require(bytes(reasonMap[reasonCode]).length > 0, 'BAD_REASON');
        citizens[wallet] = CitizenInfo(nextCitizenId++, wallet, reasonCode);
        citizenList.push(wallet);
        _count++;
        emit CitizenCreated(wallet, reasonCode);
    }
}
