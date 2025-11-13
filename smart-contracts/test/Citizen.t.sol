// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {CitizenRegistry} from "../src/CitizenRegistry.sol";
import {IAgora} from "../src/interfaces/IAgora.sol";
// import { Poll } from '../contracts/Poll.sol';

contract MockAgora is IAgora {
    ProposalType public lastPtype;
    address public lastTarget;
    uint96 public lastTotalCitizens;
    uint256 public nextId;

    function createCitizen(address target) external {}

    function hasPassed(
        address /*wallet*/
    )
        external
        pure
        returns (bool)
    {
        return true;
    }
}

contract CitizenTest is Test {
    CitizenRegistry citizenREgistry;
    IAgora mockAgora;
    address deployer = address(0xDEAD);
    address target = address(0xCAFE);

    function setUp() public {
        vm.startPrank(deployer);
        citizenREgistry = new CitizenRegistry();
        mockAgora = new MockAgora();
        citizenREgistry.setAgora(address(mockAgora));
        vm.stopPrank();
        //         assertEq(citizen.pollAddress(), address(mockPoll));
    }

    // Pre-create
    function testPropose() public {
        vm.expectEmit(true, true, true, true);
        emit CitizenRegistry.ProposalMade(deployer, target, 1);
        vm.prank(deployer);
        citizenREgistry.propose(target);
    }
    //     // Create
    //     function testCreate() public {
    //         vm.prank(address(mockPoll));
    //         citizen.createFromPoll(target);
    //         Citizen.CitizenInfo[] memory citizens = citizen.read();
    //         assertEq(citizens.length, 2, 'There should be exactly two citizen, one is deployer');
    //         assertEq(citizens[1].wallet, target, "The citizen's wallet address should match addr1");
    //     }
    // function testCannotCreateCitizenTwice() public {
    //     // Create a citizen
    //     citizenRegistry.createCitizen(addr1);
    //     // Try creating the same citizen again, expect it to fail
    //     vm.expectRevert("Already exists");
    //     citizenRegistry.createCitizen(addr1);
    // }
    // Read
    // function testTotal() public {
    //     assertEq(citizen.total(), 1);
    // }
    // function testIsCitizen() public {
    //     assertTrue(citizen.isCitizen(address(this)), 'Deployer should be a citizen');
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
