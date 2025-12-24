// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MeritRegistry.sol";

contract MeritRegistryTest is Test {
  MeritRegistry reg;

  address admin = address(0xA11CE);
  address attestor = address(0xB0B);
  address registrar = address(0xCAFE);
  address user = address(0xD00D);

  bytes32 constant SOURCE_GIT = keccak256("git");
  bytes32 subjectId;

  function setUp() public {
    vm.prank(admin);
    reg = new MeritRegistry(admin);

    vm.prank(admin);
    reg.grantRole(reg.ATTESTOR_ROLE(), attestor);

    vm.prank(admin);
    reg.grantRole(reg.REGISTRAR_ROLE(), registrar);

    subjectId = keccak256(bytes("git:gpg:ABCDEF0123456789"));
  }

  function test_linkSubject_onlyRegistrar() public {
    vm.expectRevert(); // AccessControl revert
    reg.linkSubject(subjectId, user);

    vm.prank(registrar);
    reg.linkSubject(subjectId, user);

    assertEq(reg.subjectToAccount(subjectId), user);
  }

  function test_recordContribution_nonceReplayBlocked() public {
    vm.prank(attestor);
    reg.recordContribution(subjectId, user, SOURCE_GIT, 1, 10, keccak256("ev1"), 123);

    vm.prank(attestor);
    vm.expectRevert(MeritRegistry.NonceUsed.selector);
    reg.recordContribution(subjectId, user, SOURCE_GIT, 1, 10, keccak256("ev1"), 123);
  }

  function test_recordContribution_accountMismatchBlocked() public {
    vm.prank(registrar);
    reg.linkSubject(subjectId, user);

    address other = address(0xEEEE);

    vm.prank(attestor);
    vm.expectRevert(MeritRegistry.AccountMismatch.selector);
    reg.recordContribution(subjectId, other, SOURCE_GIT, 1, 10, keccak256("ev2"), 999);
  }
}
