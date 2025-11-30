// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import {Citizen} from "../src/Citizen.sol";
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
    Citizen citizen;
    IAgora mockAgora;
    address deployer = address(0xDEAD);
    address target = address(0xCAFE);
    address a1 = address(0x1111);
    address a2 = address(0x2222);

    event CitizenAdded(address indexed citizen);

    function setUp() public {
        citizen = new Citizen();
        mockAgora = new MockAgora();

        citizen.initialize(deployer);
    }

    // Create
    function testCreate() public {
        assertEq(citizen.isCitizen(target), false);

        vm.expectEmit(true, false, false, false, address(citizen));
        emit CitizenAdded(target);

        vm.prank(deployer);
        citizen.create(target);

        assertEq(citizen.isCitizen(target), true);
    }

    // Read
    function testReadReturnsCreatedCitizens() public {
        vm.prank(deployer);
        citizen.create(a1);
        vm.prank(deployer);
        citizen.create(a2);

        address[] memory list = citizen.read();

        assertEq(list.length, 2);
        assertEq(list[0], a1);
        assertEq(list[1], a2);
    }
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
