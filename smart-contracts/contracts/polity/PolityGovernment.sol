// File: PolityGovernment.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GovernorProposalSystem.sol';
import './RuleProposalSystem.sol';

contract PolityGovernment is BaseGovernance, GovernorProposalSystem, RuleProposalSystem {
    constructor(uint256 _requiredSignatures) BaseGovernance(_requiredSignatures) {}

    // function approveUpgrade(address _newImpl) external onlyGovernor {
    //     require(!hasSigned[msg.sender], "Already approved");
    //     hasSigned[msg.sender] = true;
    //     totalSignatures++;
    //     if (totalSignatures >= requiredSignatures) {
    //         upgradeApprovedA = true;
    //         pendingImplA      = _newImpl;
    //         emit UpgradeApproved(_newImpl);
    //     }
    // }

    // function triggerUpgrade() external {
    //     require(upgradeApprovedA, "Not approved");
    //     IUUPS(proxyA).upgradeTo(pendingImplA);
    //     emit UpgradeTriggered(pendingImplA);
    //     // reset
    //     upgradeApprovedA = false;
    //     pendingImplA     = address(0);
    //     totalSignatures  = 0;
    //     for (uint256 i; i < governors.length; i++) {
    //         hasSigned[governors[i]] = false;
    //     }
    // }
}
