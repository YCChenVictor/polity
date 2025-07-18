// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BaseGovernance.sol';

abstract contract OffChainRuleProposalSystem is BaseGovernance {
    struct OffChainRuleProposal {
        address proposed;
        string billId; // Unique ID of the Bill from Taiwan Parliament
        uint256 updateTimestamp; // Timestamp of last update
    }

    struct OffChainRuleProposalView {
        address proposed;
        string billId;
        uint256 updateTimestamp;
    }

    mapping(uint256 => OffChainRuleProposal) public offChainRuleProposals;
    uint256 public offChainRuleProposalCount;

    event Created(uint256 id, address proposed, string billId);
    event Updated(uint256 id, string billId, uint256 updateTimestamp);

    // Create a new Rule Proposal
    function proposeOffChainRule(address rule, string memory billId) external onlyGovernor {
        uint256 id = offChainRuleProposalCount;
        OffChainRuleProposal storage p = offChainRuleProposals[id];
        p.proposed = rule;
        p.billId = billId;
        p.updateTimestamp = block.timestamp;
        offChainRuleProposalCount++;
        emit Created(id, rule, billId);
    }

    // List Rule Proposals
    function listOffChainRuleProposals()
        public
        view
        returns (OffChainRuleProposalView[] memory views)
    {
        uint256 n = offChainRuleProposalCount;
        views = new OffChainRuleProposalView[](n);
        for (uint256 i = 0; i < n; i++) {
            OffChainRuleProposal storage p = offChainRuleProposals[i];
            views[i] = OffChainRuleProposalView(p.proposed, p.billId, p.updateTimestamp);
        }
    }
}
