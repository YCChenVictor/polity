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
