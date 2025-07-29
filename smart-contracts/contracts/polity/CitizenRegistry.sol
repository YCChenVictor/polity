// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CitizenRegistry {
    struct Citizen {
        address wallet;
    }

    mapping(address => Citizen) public citizens;
    address[] public citizenList;

    event CitizenCreated(address wallet);

    function createCitizen(address wallet) external {
        require(citizens[wallet].wallet == address(0), 'Already exists');
        citizens[wallet] = Citizen(wallet);
        citizenList.push(wallet);
        emit CitizenCreated(wallet);
    }

    // function isCitizen(address wallet) external view returns (bool) {
    //     return citizens[wallet].wallet != address(0);
    // }

    function readCitizens() external view returns (Citizen[] memory) {
        Citizen[] memory list = new Citizen[](citizenList.length);
        for (uint i = 0; i < citizenList.length; i++) {
            list[i] = citizens[citizenList[i]];
        }
        return list;
    }
}
