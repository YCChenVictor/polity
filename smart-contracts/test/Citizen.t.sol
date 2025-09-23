// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import 'forge-std/Test.sol';
import '../../contracts/polity/Citizen.sol';
import '../../contracts/polity/DeprecableGovernment.sol';
import "../../contracts/polity/Timelock.sol";

contract MockDeprecableGovernment is IDeprecableGovernment {
    ProposalType public lastPtype;
    address public lastTarget;
    uint96 public lastTotalCitizens;
    uint256 public nextId;

    function create(
        ProposalType ptype,
        address target,
        uint96 totalCitizens
    ) external override returns (uint256 id) {
        lastPtype = ptype;
        lastTarget = target;
        lastTotalCitizens = totalCitizens;
        id = nextId++; // first id = 0
    }

    function hasPassed(address /*wallet*/) external pure returns (bool) {
        return true;
    }
}

contract CitizenTest is Test {
    Citizen citizen;
    MockDeprecableGovernment mockDeprecableGovernment;
    address deployer = address(0xDEAD);
    address target = address(0xCAFE);

    function setUp() public {
        vm.startPrank(deployer);
        timelock = new Timelock();
        citizen = new Citizen(address(timelock));
        mockDeprecableGovernment = new MockDeprecableGovernment();
        citizen.setDeprecableGovernment(address(mockDeprecableGovernment));
        vm.stopPrank();
        assertEq(citizen.deprecableGovernmentAddress(), address(mockDeprecableGovernment));
    }

    // Pre-create
    function testPropose() public {
        vm.expectEmit(true, true, true, true);
        emit Citizen.ProposalMade(deployer, target, 1);
        vm.prank(deployer);
        citizen.propose(target);
    }

    // Create
    function testCreate() public {
        vm.prank(address(mockDeprecableGovernment));
        citizen.create(target);
        Citizen.CitizenInfo[] memory citizens = citizen.read();
        assertEq(citizens.length, 2, 'There should be exactly two citizen, one is deployer');
        assertEq(citizens[1].wallet, target, "The citizen's wallet address should match addr1");
    }

    // function testCannotCreateCitizenTwice() public {
    //     // Create a citizen
    //     citizenRegistry.createCitizen(addr1);

    //     // Try creating the same citizen again, expect it to fail
    //     vm.expectRevert("Already exists");
    //     citizenRegistry.createCitizen(addr1);
    // }

    // Read
    function testTotal() public {
        assertEq(citizen.total(), 1);
    }

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
