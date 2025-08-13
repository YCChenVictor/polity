// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';
import '../../contracts/polity/Citizen.sol';

contract CitizenTest is Test {
    Citizen citizen;
    address addr1 = address(0x123);
    address addr2 = address(0x456);

    function setUp() public {
        citizen = new Citizen();
    }

    function testCreateCitizen() public {
        citizen.create(addr1, 1);
        Citizen.Citizen[] memory citizens = citizen.read();
        assertEq(citizens.length, 1, 'There should be exactly one citizen');
        assertEq(citizens[0].wallet, addr1, "The citizen's wallet address should match addr1");
    }

    // function testCannotCreateCitizenTwice() public {
    //     // Create a citizen
    //     citizenRegistry.createCitizen(addr1);

    //     // Try creating the same citizen again, expect it to fail
    //     vm.expectRevert("Already exists");
    //     citizenRegistry.createCitizen(addr1);
    // }

    // function testGetAllCitizens() public {
    //     // Add two citizens
    //     citizenRegistry.createCitizen(addr1);
    //     citizenRegistry.createCitizen(addr2);

    //     // Retrieve all citizens
    //     CitizenRegistry.Citizen[] memory citizens = citizenRegistry.getAllCitizens();

    //     // Assert the list length and the citizen addresses
    //     assertEq(citizens.length, 2, "There should be two citizens");
    //     assertEq(citizens[0].wallet, addr1, "The first citizen's address is incorrect");
    //     assertEq(citizens[1].wallet, addr2, "The second citizen's address is incorrect");
    // }

    // function testGetAllCitizensWhenEmpty() public {
    //     // Retrieve all citizens when no one is created
    //     CitizenRegistry.Citizen[] memory citizens = citizenRegistry.getAllCitizens();

    //     // Assert that the citizens list is empty
    //     assertEq(citizens.length, 0, "There should be no citizens");
    // }
}
