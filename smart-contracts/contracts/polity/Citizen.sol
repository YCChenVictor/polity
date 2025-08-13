// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Citizen {
    struct Citizen {
        uint256 id;
        address wallet;
        uint8 reasonCode;
    }

    mapping(address => Citizen) public citizens;
    address[] public citizenList;
    uint256 public nextCitizenId = 1;

    mapping(uint8 => string) public reasonMap;

    event CitizenCreated(address wallet, uint8 reasonCode);

    constructor() {
        // Should be done by deployer
        reasonMap[1] = 'born';
        reasonMap[2] = 'immigrate';
    }

    function create(address wallet, uint8 reasonCode) external {
        require(citizens[wallet].wallet == address(0), 'Already exists');
        require(bytes(reasonMap[reasonCode]).length > 0, 'Invalid reason code');

        citizens[wallet] = Citizen(nextCitizenId++, wallet, reasonCode);
        citizenList.push(wallet);
        emit CitizenCreated(wallet, reasonCode);
    }

    function read() external view returns (Citizen[] memory) {
        Citizen[] memory list = new Citizen[](citizenList.length);
        for (uint i = 0; i < citizenList.length; i++) {
            list[i] = citizens[citizenList[i]];
        }
        return list;
    }
}
