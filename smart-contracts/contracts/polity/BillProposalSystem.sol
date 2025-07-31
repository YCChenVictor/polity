// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BaseGovernance.sol';

abstract contract OffChainRuleProposalSystem is BaseGovernance {
    struct OffChainRuleProposal {
        address proposed;
        string billNumber;
        uint256 votes;
        string billId; // Unique ID of the Bill from Taiwan Parliament
        bool executed;
        mapping(address => bool) hasVoted;
        uint256 updateTimestamp; // Timestamp of last update
    }

    struct OffChainRuleProposalView {
        address proposed;
        string billNumber;
        string billId;
        uint256 votes;
        uint256 updateTimestamp;
    }

    mapping(uint256 => OffChainRuleProposal) public offChainRuleProposals;
    uint256 public offChainRuleProposalCount;

    event OffChainRuleVoteCast(uint256 indexed id, address indexed voter, uint256 votes);
    event Created(uint256 id, address proposed, string billId);
    event Updated(uint256 id, string billId, uint256 updateTimestamp);

    // Create
    function proposeOffChainRule(
        address rule,
        string memory billNumber,
        string memory billId
    ) external onlyGovernor {
        uint256 id = offChainRuleProposalCount;
        OffChainRuleProposal storage p = offChainRuleProposals[id];
        p.proposed = rule;
        p.billId = billId;
        p.billNumber = billNumber;
        p.updateTimestamp = block.timestamp;
        offChainRuleProposalCount++;
        emit Created(id, rule, billId);
    }

    // Read
    function listProposalsFromBill() public view returns (OffChainRuleProposalView[] memory views) {
        uint256 n = offChainRuleProposalCount;
        views = new OffChainRuleProposalView[](n);
        for (uint256 i = 0; i < n; i++) {
            OffChainRuleProposal storage p = offChainRuleProposals[i];
            views[i] = OffChainRuleProposalView(
                p.proposed,
                p.billNumber,
                p.billId,
                p.votes,
                p.updateTimestamp
            );
        }
    }

    // Update
    function voteRuleFromBill(uint256 id) external onlyGovernor {
        OffChainRuleProposal storage p = offChainRuleProposals[id];
        require(!p.executed, 'Already executed');
        require(!p.hasVoted[msg.sender], 'Already voted');
        p.hasVoted[msg.sender] = true;
        p.votes += 1;
        emit OffChainRuleVoteCast(id, msg.sender, p.votes);
        // if (p.votes >= getRequiredSignatures()) {
        //     _executeAdd(id);
        // }
    }
}
