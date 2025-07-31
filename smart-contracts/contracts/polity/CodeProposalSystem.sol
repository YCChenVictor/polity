// The concept
// 1. Governors need to deploy their rules on chain
// 2. Governors can purpose this contract to the rule proposal system and raise votes

import './BaseGovernance.sol';

// This is actually on chain rules
abstract contract RuleProposalSystem is BaseGovernance {
    struct RuleProposal {
        address proposed;
        uint256 votes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    struct RuleProposalView {
        address proposed;
        uint256 votes;
        bool executed;
    }

    mapping(uint256 => RuleProposal) public ruleProposals;
    uint256 public ruleProposalCount;

    event RuleVoteCast(uint256 indexed id, address indexed voter, uint256 votes);
    event Created(uint256 id, address proposed);
    event Added(address indexed newRule);

    // Create
    function proposeRule(address rule) external onlyGovernor {
        uint256 id = ruleProposalCount;
        RuleProposal storage p = ruleProposals[id];
        p.proposed = rule;
        ruleProposalCount++;
        emit Created(id, rule);
    }

    // Read
    // By design of solidity, directly returning the arrays of the variables is still valid because there is no way to return struct.
    function listProposalsFromCode() public view returns (RuleProposalView[] memory views) {
        uint256 n = ruleProposalCount;
        views = new RuleProposalView[](n);
        for (uint256 i = 0; i < n; i++) {
            RuleProposal storage p = ruleProposals[i];
            views[i] = RuleProposalView(p.proposed, p.votes, p.executed);
        }
    }

    // Update
    function voteRuleFromCode(uint256 id) external onlyGovernor {
        RuleProposal storage p = ruleProposals[id];
        require(!p.executed, 'Already executed');
        require(!p.hasVoted[msg.sender], 'Already voted');
        p.hasVoted[msg.sender] = true;
        p.votes += 1;
        emit RuleVoteCast(id, msg.sender, p.votes);
        // if (p.votes >= getRequiredSignatures()) {
        //     _executeAdd(id);
        // }
    }

    // This one was wrong, it adds governors
    // function _executeAdd(uint256 id) internal {
    //     RuleProposal storage p = ruleProposals[id];
    //     require(!p.executed, 'Already executed');
    //     require(p.votes >= getRequiredSignatures(), 'Not enough votes');
    //     p.executed = true;
    //     governors.push(p.proposed);
    //     emit Added(p.proposed);
    // }
}
