// The concept
// 1. Governors need to deploy their rules on chain
// 2. Governors can purpose this contract to the rule proposal system and raise votes

import './BaseGovernance.sol';

abstract contract RuleProposalSystem is BaseGovernance {
    struct Proposal {
        address proposed;
        uint256 votes;
    }
    Proposal[] public proposals;

    event Created(uint256 id, address proposed);

    // Create
    function proposeRule(address newRule) external onlyGovernor {
        // Going to add more checks, for example, the contract should be UUPS
        proposals.push(Proposal({ proposed: newRule, votes: 0 }));
        emit Created(proposals.length - 1, newRule);
    }

    // Read
    function listRuleProposals() external view returns (Proposal[] memory) {
        return proposals;
    }
}
