// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPoll {
    function create(address target, bytes calldata data, address proposer) external;
}

contract Citizen {
    struct Citizen {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }

    IPoll public poll;
    address public bootstrapOwner = msg.sender;

    mapping(address => Citizen) public citizens;
    address[] public citizenList;
    uint256 private _count;
    uint256 public nextCitizenId = 1;
    mapping(uint8 => string) public reasonMap;

    event CitizenCreated(address wallet, uint8 reasonCode);

    constructor() {
        // Should be done by deployer
        reasonMap[1] = 'born';
        reasonMap[2] = 'immigrate';
    }

    // Citizens
    function propose(address target, bytes calldata data) external {
        require(isCitizen(msg.sender), 'NOT_CITIZEN');
        require(address(poll) != address(0), 'PM_NOT_SET');
        poll.create(target, data, msg.sender);
    }

    function create(address wallet, uint8 reasonCode) external {
        require(citizens[wallet].wallet == address(0), 'Already exists');
        require(bytes(reasonMap[reasonCode]).length > 0, 'Invalid reason code');

        citizens[wallet] = Citizen(nextCitizenId++, wallet, reasonCode);
        citizenList.push(wallet);
        _count++;
        emit CitizenCreated(wallet, reasonCode);
    }

    function read() external view returns (Citizen[] memory) {
        Citizen[] memory list = new Citizen[](citizenList.length);
        for (uint i = 0; i < citizenList.length; i++) {
            list[i] = citizens[citizenList[i]];
        }
        return list;
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
}
