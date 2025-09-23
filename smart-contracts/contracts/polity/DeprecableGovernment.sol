// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICitizen {
    function total() external view returns (uint256);
    function createFromPoll(address wallet) external;
}

contract DeprecableGovernment {
    error OnlyTimelock();
    error OnlyCitizen();

    address public immutable timelock;

    ICitizen public citizen;

    struct Proposal {
        ProposalType proposalType;
        address proposer;
        uint64 deadlineAt;
        uint96 quorumBase;
        bool finalized;
        address target;
        bytes cid; // CIDv1 bytes (multibase removed) -> the IFPS can have the immigrates address and other files
        bytes32 dataHash; // keccak256(json) for integrity
        bytes32 subjectKey;
    }
    struct View {
        uint256 id;
        bytes cid; // IFPS
        bytes32 dataHash;
        uint64 deadlineAt;
        uint96 quorumBase;
        uint256 yes;
        uint256 no;
        bool finalized;
        address proposer;
    }
    enum ProposalType {
        ConfigChange,
        Immigration,
        Custom
    }

    uint16 public minVotesPercent;
    uint64 public votingSeconds;
    uint256 public nextId;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => bool) public finalized;
    mapping(uint256 => bool) public approved;
    mapping(uint256 => mapping(address => bool)) public voted;
    mapping(uint256 => uint32) public yesVotes;
    mapping(uint256 => uint32) public noVotes;
    mapping(address => uint256) public proposalsByTarget;

    event Proposed(uint256 id, ProposalType ptype);
    event Voted(uint256 id, address voter, bool support);
    event Implemented(uint256 id, address target);
    event Finalized(uint256 id, bool passed);

    constructor(
        address _timelock,
        address _citizen,
        uint16 _minVotesPercent,
        uint32 _votingSeconds
    ) {
        timelock = _timelock;
        citizen = ICitizen(_citizen);
        _setConfig(_minVotesPercent, _votingSeconds);
    }

    function create(
        ProposalType proposalType,
        address target,
        uint96 totalCitizens
    ) external returns (uint256 id) {
        // check arguments first
        if (proposalType == ProposalType.Immigration) {
            require(target != address(0), 'TARGET_REQUIRED');
        } else {
            require(target == address(0), 'TARGET_NOT_ALLOWED');
        }

        // increment and get id first
        id = nextId++;

        // now store into proposals[id]
        Proposal storage proposal = proposals[id];
        proposal.proposalType = proposalType;
        proposal.proposer = msg.sender;
        proposal.quorumBase = totalCitizens;
        proposal.deadlineAt = uint64(block.timestamp + votingSeconds);

        if (proposalType == ProposalType.Immigration) {
            proposal.target = target;
        }

        emit Proposed(id, proposalType);
    }

    function listImmigrationPolls() public view returns (View[] memory views) {
        uint256 n = nextId;

        // 1) count Immigration proposals
        uint256 count;
        for (uint256 i; i < n; ) {
            if (proposals[i].proposalType == ProposalType.Immigration) count++;
            unchecked {
                ++i;
            }
        }

        // 2) allocate and fill
        views = new View[](count);
        uint256 k;
        for (uint256 i; i < n; ) {
            Proposal storage p = proposals[i];
            if (p.proposalType == ProposalType.Immigration) {
                views[k++] = View({
                    id: i,
                    cid: p.cid,
                    dataHash: p.dataHash,
                    deadlineAt: p.deadlineAt,
                    quorumBase: p.quorumBase,
                    yes: yesVotes[i],
                    no: noVotes[i],
                    finalized: p.finalized,
                    proposer: p.proposer
                });
            }
            unchecked {
                ++i;
            }
        }
    }

    function vote(uint256 id, bool support) external {
        require(id < nextId, 'NO_SUCH_PROPOSAL');
        require(block.timestamp < proposals[id].deadlineAt, 'VOTING_ENDED');
        require(!voted[id][msg.sender], 'ALREADY_VOTED');

        voted[id][msg.sender] = true;

        if (support) {
            yesVotes[id] += 1;
        } else {
            noVotes[id] += 1;
        }

        emit Voted(id, msg.sender, support);
    }

    function finalize(uint256 id) public {
        require(id < nextId, 'NO_SUCH');
        require(block.timestamp >= proposals[id].deadlineAt, 'NOT_ENDED');
        require(!finalized[id], 'FINALIZED');

        uint256 total = uint256(yesVotes[id]) + uint256(noVotes[id]);
        bool majority = yesVotes[id] > noVotes[id];
        bool quorumOk = (minVotesPercent == 0)
            ? true
            : (proposals[id].quorumBase > 0 &&
                total * 100 >= minVotesPercent * uint256(proposals[id].quorumBase));

        bool ok = (majority && quorumOk);
        approved[id] = ok;
        finalized[id] = true;

        emit Finalized(id, ok);

        if (ok) {
            citizen.createFromPoll(proposals[id].target);
        }
    }

    function hasPassed(address immigrationWallet) external view returns (bool) {
        uint256 id = proposalsByTarget[immigrationWallet];
        return approved[id];
    }

    function currentConfig() external view returns (uint16, uint64) {
        return (minVotesPercent, votingSeconds);
    }

    function _setConfig(uint16 _minVotesPercent, uint32 _votingSeconds) internal {
        require(_minVotesPercent <= 10000, '>100%');
        require(_votingSeconds > 0, 'DURATION_ZERO');
        minVotesPercent = _minVotesPercent;
        votingSeconds = _votingSeconds;
    }
}
