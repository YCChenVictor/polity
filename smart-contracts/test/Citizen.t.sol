// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';
import '../../contracts/polity/Citizen.sol';
import '../../contracts/polity/Poll.sol';

contract CitizenTest is Test {
    Citizen citizen;
    Poll poll;
    address addr1 = address(0x123);
    address proposal = address(0xCAFE);

    function setUp() public {
        citizen = new Citizen();
        poll = new Poll(51);
        citizen.setPoll(address(poll));
    }

    function testCreate() public {
        citizen.create(addr1, 1);
        Citizen.CitizenInfo[] memory citizens = citizen.read();
        assertEq(citizens.length, 2, 'There should be exactly two citizen, one is deployer');
        assertEq(citizens[1].wallet, addr1, "The citizen's wallet address should match addr1");
    }

    function testPropose() public {
        vm.expectEmit(true, true, true, true);
        emit Citizen.ProposalMade(address(this), proposal, 1);
        citizen.propose(proposal);
    }

    function testTotal() public {
        assertEq(citizen.total(), 1);
    }

    function testIsCitizen() public {
        assertTrue(citizen.isCitizen(address(this)), "Deployer should be a citizen");
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
