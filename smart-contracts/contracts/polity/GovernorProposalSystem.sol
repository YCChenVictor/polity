// File: contracts/GovernorProposalSystem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BaseGovernance.sol';

abstract contract GovernorProposalSystem is BaseGovernance {
    struct GovernorProposal {
        address proposed;
        uint256 votes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => GovernorProposal) public governorProposals;
    uint256 public governorProposalCount;

    event GovernorProposalCreated(uint256 indexed id, address indexed proposed);
    event GovernorVoteCast(uint256 indexed id, address indexed voter, uint256 votes);
    event GovernorAdded(address indexed newGovernor);

    // Create
    function proposeGovernor(address newGovernor) external onlyGovernor {
        uint256 id = governorProposalCount++;
        GovernorProposal storage p = governorProposals[id];
        p.proposed = newGovernor;
        emit GovernorProposalCreated(id, newGovernor);
    }

    // Read
    function listGovernorProposals()
        external
        view
        returns (address[] memory proposed, uint256[] memory votesArr, bool[] memory executedArr)
    {
        uint256 n = governorProposalCount;
        proposed = new address[](n);
        votesArr = new uint256[](n);
        executedArr = new bool[](n);
        for (uint256 i = 0; i < n; i++) {
            GovernorProposal storage p = governorProposals[i];
            proposed[i] = p.proposed;
            votesArr[i] = p.votes;
            executedArr[i] = p.executed;
        }
    }

    // Update
    function voteGovernor(uint256 id) external onlyGovernor {
        GovernorProposal storage p = governorProposals[id];
        require(!p.executed, 'Already executed');
        require(!p.hasVoted[msg.sender], 'Already voted');
        p.hasVoted[msg.sender] = true;
        p.votes += 1;
        emit GovernorVoteCast(id, msg.sender, p.votes);
        if (p.votes >= requiredSignatures) {
            _executeAddGovernor(id);
        }
    }

    function _executeAddGovernor(uint256 id) internal {
        GovernorProposal storage p = governorProposals[id];
        require(!p.executed, 'Already executed');
        require(p.votes >= requiredSignatures, 'Not enough votes');
        p.executed = true;
        governors.push(p.proposed);
        emit GovernorAdded(p.proposed);
    }
}
