// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

import { Governor } from '@openzeppelin/contracts/governance/Governor.sol';
import { GovernorSettings } from '@openzeppelin/contracts/governance/extensions/GovernorSettings.sol';
import { GovernorCountingSimple } from '@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol';
import { GovernorVotes } from '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import { GovernorVotesQuorumFraction } from '@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol';
import { IVotes } from '@openzeppelin/contracts/governance/utils/IVotes.sol';

interface ICitizen {
    function total() external view returns (uint256);
    function isCitizen(address) external returns (bool);
}

contract Poll is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    enum ProposalType {
        ConfigChange,
        Immigration,
        Custom
    }
    event Proposed(ProposalType kind);

    constructor(
        IVotes token
    )
        Governor('Poll')
        GovernorSettings(1, 45818, 0) // delay, period, threshold
        GovernorVotes(token)
        GovernorVotesQuorumFraction(4) // 4% quorum (example)
    {}

    function create(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        ProposalType proposalType
    ) external returns (uint256 id) {
        if (proposalType == ProposalType.Immigration) {
            require(targets.length > 0 && targets[0] != address(0), 'TARGET_REQUIRED');
        }
        id = super.propose(targets, values, calldatas, 'Pure signalling vote');
        emit Proposed(proposalType);
    }

    // ===== required overrides =====
    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    ) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}

// contract Poll is Governor, GovernorVotes, GovernorVotesQuorumFraction {
// Governor,
// GovernorSettings,
// GovernorCountingSimple
// ICitizen public citizen;
// uint16 public minVotesPercent;
// enum ProposalType {
//     ConfigChange,
//     Immigration,
//     Custom
// }

// event Proposed(uint256 id, ProposalType ptype);
//     event Voted(uint256 id, address voter, bool support);
//     event Implemented(uint256 id, address target);
//     event Finalized(uint256 id, bool passed);

// constructor(
//     IVotes _token
// ICitizen _citizen,
// uint16 _minVotesPercent,
// uint32 votingSeconds
// )
//     Governor('Poll')
//     GovernorVotes(_token)
//     GovernorVotesQuorumFraction(4)
// GovernorSettings(/*delay*/1, /*period*/votingSeconds, /*threshold*/0)
// {
// citizen = _citizen;
// minVotesPercent = _minVotesPercent;
// }

// function create(
//     address[] memory targets,
//     uint256[] memory values,
//     bytes[] memory calldatas,
//     ProposalType proposalType
// ) external returns (uint256 id) {
//     if (proposalType == ProposalType.Immigration) {
//         require(targets.length > 0 && targets[0] != address(0), 'TARGET_REQUIRED');
//     }

//     id = super.propose(
//         targets, // the address to execute calldatas once vote pass
//         values,
//         calldatas,
//         'Pure signalling vote'
//     );

//     emit Proposed(id, proposalType);
// }

// ===== required overrides =====

// 1p1v power source (no token). If you add snapshot funcs, read them here.
// function _getVotes(address account, uint256 /*blockNumber*/, bytes memory)
//     internal view override returns (uint256)
// {
//     return citizen.isCitizen(account) ? 1 : 0;
// }

// function quorum(uint256 blockNumber)
//     public
//     view
//     override(IGovernor, GovernorVotesQuorumFraction)
//     returns (uint256)
// {
//     return super.quorum(blockNumber);
// }

// function votingDelay()
//     public view override(Governor) returns (uint256)
// { return 1; }

// function votingPeriod() public pure override returns (uint256) {
//     return 45818;
// }

// function proposalThreshold() public pure override returns (uint256) {
//     return 0;
// }

//     function proposalThreshold()
//         public
//         view
//         override(Governor, GovernorSettings)
//         returns (uint256)
//     {
//         return super.proposalThreshold();
//     }

//     struct Proposal {
//         ProposalType proposalType;
//         address proposer;
//         uint64 deadlineAt;
//         uint96 quorumBase;
//         bool finalized;
//         address target;
//         bytes cid; // CIDv1 bytes (multibase removed) -> the IFPS can have the immigrates address and other files
//         bytes32 dataHash; // keccak256(json) for integrity
//         bytes32 subjectKey;
//     }
//     struct View {
//         uint256 id;
//         bytes cid; // IFPS
//         bytes32 dataHash;
//         uint64 deadlineAt;
//         uint96 quorumBase;
//         uint256 yes;
//         uint256 no;
//         bool finalized;
//         address proposer;
//     }

//     uint16 public minVotesPercent;
//     uint64 public votingSeconds;
//     uint256 public nextId;

//     mapping(uint256 => Proposal) public proposals;
//     mapping(uint256 => bool) public finalized;
//     mapping(uint256 => bool) public approved;
//     mapping(uint256 => mapping(address => bool)) public voted;
//     mapping(uint256 => uint32) public yesVotes;
//     mapping(uint256 => uint32) public noVotes;
//     mapping(address => uint256) public proposalsByTarget;

//     function listImmigrationPolls() public view returns (View[] memory views) {
//         uint256 n = nextId;

//         // 1) count Immigration proposals
//         uint256 count;
//         for (uint256 i; i < n; ) {
//             if (proposals[i].proposalType == ProposalType.Immigration) count++;
//             unchecked {
//                 ++i;
//             }
//         }

//         // 2) allocate and fill
//         views = new View[](count);
//         uint256 k;
//         for (uint256 i; i < n; ) {
//             Proposal storage p = proposals[i];
//             if (p.proposalType == ProposalType.Immigration) {
//                 views[k++] = View({
//                     id: i,
//                     cid: p.cid,
//                     dataHash: p.dataHash,
//                     deadlineAt: p.deadlineAt,
//                     quorumBase: p.quorumBase,
//                     yes: yesVotes[i],
//                     no: noVotes[i],
//                     finalized: p.finalized,
//                     proposer: p.proposer
//                 });
//             }
//             unchecked {
//                 ++i;
//             }
//         }
//     }

//     function vote(uint256 id, bool support) external {
//         require(id < nextId, 'NO_SUCH_PROPOSAL');
//         require(block.timestamp < proposals[id].deadlineAt, 'VOTING_ENDED');
//         require(!voted[id][msg.sender], 'ALREADY_VOTED');

//         voted[id][msg.sender] = true;

//         if (support) {
//             yesVotes[id] += 1;
//         } else {
//             noVotes[id] += 1;
//         }

//         emit Voted(id, msg.sender, support);
//     }

//     function finalize(uint256 id) public {
//         require(id < nextId, 'NO_SUCH');
//         require(block.timestamp >= proposals[id].deadlineAt, 'NOT_ENDED');
//         require(!finalized[id], 'FINALIZED');

//         uint256 total = uint256(yesVotes[id]) + uint256(noVotes[id]);
//         bool majority = yesVotes[id] > noVotes[id];
//         bool quorumOk = (minVotesPercent == 0)
//             ? true
//             : (proposals[id].quorumBase > 0 &&
//                 total * 100 >= minVotesPercent * uint256(proposals[id].quorumBase));

//         bool ok = (majority && quorumOk);
//         approved[id] = ok;
//         finalized[id] = true;

//         emit Finalized(id, ok);

//         if (ok) {
//             citizen.createFromPoll(proposals[id].target);
//         }
//     }

//     function hasPassed(address immigrationWallet) external view returns (bool) {
//         uint256 id = proposalsByTarget[immigrationWallet];
//         return approved[id];
//     }

//     function currentConfig() external view returns (uint16, uint64) {
//         return (minVotesPercent, votingSeconds);
//     }

//     function _setConfig(uint16 _minVotesPercent) internal {
//         require(_minVotesPercent <= 10000, '>100%');
//         minVotesPercent = _minVotesPercent;
//     }

//     // function implement(uint256 id) external {
//     //     require(id < nextId, "NO_SUCH_PROPOSAL");
//     //     require(passed[id], "NOT_PASSED");
//     //     require(!implemented[id], "ALREADY_IMPLEMENTED");
//     //     implemented[id] = true;

//     //     address who = props[id].target;
//     //     require(who != address(0), "NO_TARGET");
//     //     registry.addCitizen(who);

//     //     emit Implemented(id, who);
//     // }
// }
