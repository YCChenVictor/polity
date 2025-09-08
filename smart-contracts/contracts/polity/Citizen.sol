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
        uint256 totalCitizens
    ) external returns (uint256 id);
}

contract Citizen {
    struct CitizenInfo {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }

    IPoll public poll;
    address public bootstrapOwner = msg.sender;

    mapping(address => CitizenInfo) public citizens;
    address[] public citizenList;
    uint256 private _count;
    uint256 public nextCitizenId = 1;
    mapping(uint8 => string) public reasonMap;

    event CitizenCreated(address wallet, uint8 reasonCode);

    constructor() {
        reasonMap[1] = 'born';
        reasonMap[2] = 'immigrate';
        _create(msg.sender, 1); // deployer becomes citizen
    }

    // Citizens
    function propose(address target) external {
        require(isCitizen(msg.sender), 'NOT_CITIZEN');
        require(address(poll) != address(0), 'PM_NOT_SET');
        poll.create(IPoll.ProposalType.Target, target, _count);
    }

    function create(address wallet, uint8 reasonCode) external {
        _create(wallet, reasonCode);
    }

    function read() external view returns (CitizenInfo[] memory list) {
        list = new CitizenInfo[](citizenList.length);
        for (uint i = 0; i < citizenList.length; i++) list[i] = citizens[citizenList[i]];
    }

    function total() external view returns (uint256) {
        return _count;
    }

    function isCitizen(address a) public view returns (bool) {
        return citizens[a].wallet != address(0);
    }

    // Polls
    function setPoll(address pm) external {
        if (address(poll) == address(0)) {
            require(msg.sender == bootstrapOwner, 'BOOTSTRAP_ONLY');
            require(pm != address(0), 'ZERO');
            poll = IPoll(pm);
            bootstrapOwner = address(0); // burn
        } else {
            require(msg.sender == address(poll), 'PM_ONLY');
            poll = IPoll(pm);
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
