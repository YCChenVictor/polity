// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/polity/PolityGovernment.sol";

contract MockUUPS is IUUPS {
    address public currentImpl;

    function upgradeTo(address newImplementation) external override {
        currentImpl = newImplementation;
    }
}

contract PolityGovernmentTest is Test {
    PolityGovernment polity;
    MockUUPS proxy;

    address[] governors;
    address initGovernor;
    address newGovernor;
    address newImpl;

    function setUp() public {
        initGovernor = address(0x1);
        governors.push(initGovernor);

        proxy = new MockUUPS();
        newImpl = address(0x9999);

        polity = new PolityGovernment(governors, 1, address(proxy));
    }

    function testAddGovernor() public {
        vm.prank(initGovernor);
        polity.addGovernor(newGovernor);
        assertTrue(polity.isGovernor(newGovernor));
    }

    function testListGovernorReturnsInitialGovernor() public {
        address[] memory listed = polity.getGovernors();
    
        assertEq(listed.length, 1);
        assertEq(listed[0], initGovernor);
    }

    function testListAddGovernorProposals() public {
        address newGov1 = address(0x1);
        address newGov2 = address(0x2);

        vm.prank(initGovernor);
        polity.proposeAddGovernor(newGov1);
        vm.prank(initGovernor);
        polity.proposeAddGovernor(newGov2);

        (address[] memory proposeds, uint256[] memory votes, bool[] memory executed) =
            polity.listAddGovernorProposals();

        assertEq(proposeds.length, 2);
        assertEq(votes.length, 2);
        assertEq(executed.length, 2);

        assertEq(proposeds[0], newGov1);
        assertEq(proposeds[1], newGov2);
        assertEq(votes[0], 0);
        assertEq(votes[1], 0);
        assertFalse(executed[0]);
        assertFalse(executed[1]);
    }

    function testApproveAndTriggerUpgrade() public {
        vm.prank(initGovernor);
        polity.approveUpgrade(newImpl);

        polity.triggerUpgrade();

        assertEq(proxy.currentImpl(), newImpl);

        assertFalse(polity.upgradeApprovedA());
        assertEq(polity.pendingImplA(), address(0));
    }

    function testTriggerRevertsIfNotApproved() public {
        vm.expectRevert("Not approved");
        polity.triggerUpgrade();
    }
}
