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

    address[] signers;
    address signer1;
    address signer2;
    address signer3;
    address newImpl;

    function setUp() public {
        signer1 = address(0x1);
        signer2 = address(0x2);
        signer3 = address(0x3);

        signers.push(signer1);
        signers.push(signer2);
        signers.push(signer3);

        proxy = new MockUUPS();
        newImpl = address(0x9999);

        polity = new PolityGovernment(signers, 2, address(proxy));
    }

    function testApproveAndTriggerUpgrade() public {
        // Signer 1 approves
        vm.prank(signer1);
        polity.approveUpgrade(newImpl);

        // Signer 2 approves
        vm.prank(signer2);
        polity.approveUpgrade(newImpl);

        // Trigger upgrade
        polity.triggerUpgrade();

        // Assert upgrade happened
        assertEq(proxy.currentImpl(), newImpl);

        // Assert state reset
        assertFalse(polity.upgradeApprovedA());
        assertEq(polity.pendingImplA(), address(0));
    }

    function testTriggerRevertsIfNotApproved() public {
        vm.expectRevert("Not approved");
        polity.triggerUpgrade();
    }
}
