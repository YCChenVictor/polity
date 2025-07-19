// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import '../../contracts/polity/PolityGovernment.sol';
import 'forge-std/Test.sol';

contract MockUUPS {
    address public currentImpl;
}

contract PolityGovernmentTest is Test {
    PolityGovernment polity;
    MockUUPS proxy;

    address public deployer;
    address[] governors;
    address initGovernor;
    address newGovernor;
    address newImpl;
    address newRule;

    function setUp() public {
        initGovernor = address(0x1);
        proxy = new MockUUPS();
        vm.prank(initGovernor);
        polity = new PolityGovernment(1);
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

    function testListGovernorProposals() public {
        address newGov1 = address(0x1);
        address newGov2 = address(0x2);

        vm.prank(initGovernor);
        polity.proposeGovernor(newGov1);
        vm.prank(initGovernor);
        polity.proposeGovernor(newGov2);

        GovernorProposalSystem.GovernorProposalView[] memory proposals = polity
            .listGovernorProposals();

        for (uint256 i = 0; i < proposals.length; i++) {
            console.log('--- Proposal %s ---', i);
            console.log('Proposed: %s', proposals[i].proposed);
            console.log('Votes: %s', proposals[i].votes);
            console.log('Executed: %s', proposals[i].executed);
        }

        assertEq(proposals[0].proposed, newGov1);
        assertEq(proposals[1].proposed, newGov2);
    }

    function testVoteGovernorWorksAndExecutesWhenThresholdMet() public {
        address actualDeployer = polity.deployer();
        vm.prank(actualDeployer);
        address newGov3 = address(0x3);
        polity.proposeGovernor(newGov3);

        vm.prank(actualDeployer);
        polity.voteGovernor(0);

        GovernorProposalSystem.GovernorProposalView[] memory proposals = polity
            .listGovernorProposals();

        assertEq(proposals[0].votes, 1);
        assertTrue(proposals[0].executed);
    }

    // On chain Rules
    function testListRuleProposals() public {
        vm.prank(initGovernor);
        polity.proposeRule(address(0x1));

        RuleProposalSystem.RuleProposalView[] memory proposals = polity.listRuleProposals();

        assertEq(proposals.length, 1);
        assertEq(proposals[0].proposed, address(0x1));
        assertEq(proposals[0].votes, 0);
        assertFalse(proposals[0].executed);
    }

    function testVoteRuleWorksAndExecutesWhenThresholdMet() public {
        address actualDeployer = polity.deployer();
        vm.prank(actualDeployer);
        newRule = address(0x10);
        polity.proposeRule(newRule);

        vm.prank(actualDeployer);
        polity.voteRule(0);

        RuleProposalSystem.RuleProposalView[] memory proposals = polity.listRuleProposals();

        assertEq(proposals[0].votes, 1);
        assertTrue(proposals[0].executed);
    }

    // Off Chain Rules
    function testListOffChainRuleProposals() public {
        vm.prank(initGovernor);
        polity.proposeOffChainRule(address(0x1), 'Bill123');

        OffChainRuleProposalSystem.OffChainRuleProposalView[] memory proposals = polity
            .listOffChainRuleProposals();

        assertEq(proposals.length, 1);
        assertEq(proposals[0].proposed, address(0x1));
    }

    // function testApproveAndTriggerUpgrade() public {
    //     vm.prank(initGovernor);
    //     polity.approveUpgrade(newImpl);

    //     polity.triggerUpgrade();

    //     assertEq(proxy.currentImpl(), newImpl);

    //     assertFalse(polity.upgradeApprovedA());
    //     assertEq(polity.pendingImplA(), address(0));
    // }

    // function testTriggerRevertsIfNotApproved() public {
    //     vm.expectRevert("Not approved");
    //     polity.triggerUpgrade();
    // }
}
