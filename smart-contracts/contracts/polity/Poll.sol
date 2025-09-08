// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICitizen {
    function total() external view returns (uint256);
}

contract Poll {
    struct Proposal {
        ProposalType proposalType;
        string content;
        address target;
        uint64 deadlineAt;
        uint256 quorumBase;
    }
    struct View {
        uint256 id;
        string content;
        uint32 yes;
        uint32 no;
    }

    enum ProposalType {
        ConfigChange,
        Immigration,
        Custom
    }

    uint16 public minVotesPercent;
    uint64 public votingSeconds;
    uint256 public nextId;

    mapping(uint256 => bool) public finalized;
    mapping(uint256 => bool) public passed;
    mapping(uint256 => Proposal) public props;
    mapping(uint256 => mapping(address => bool)) public voted;
    mapping(uint256 => uint32) public yesVotes;
    mapping(uint256 => uint32) public noVotes;

    event Proposed(uint256 id, ProposalType ptype, address target, uint64 deadlineAt);
    event Voted(uint256 id, address voter, bool support);
    event Implemented(uint256 id, address target);
    event Finalized(uint256 id, bool passed);

    constructor(uint16 _minVotesPercent, uint32 _votingSeconds) {
        _setConfig(_minVotesPercent, _votingSeconds);
    }

    function create(
        ProposalType proposalType,
        address target,
        uint256 totalCitizens
    ) external returns (uint256 id) {
        id = nextId++;
        Proposal storage p = props[id];
        p.proposalType = proposalType;
        p.target = target;
        p.deadlineAt = uint64(block.timestamp + votingSeconds);
        p.quorumBase = totalCitizens;

        emit Proposed(id, proposalType, target, p.deadlineAt);
    }

    function list() public view returns (View[] memory views) {
        uint256 n = nextId;
        views = new View[](n);
        for (uint256 i = 0; i < n; i++) {
            Proposal storage p = props[i];
            views[i] = View(
                i, // id
                p.content, // content
                yesVotes[i], // yes
                noVotes[i] // no
            );
        }
    }

    function vote(uint256 id, bool support) external {
        require(id < nextId, 'NO_SUCH_PROPOSAL');
        require(block.timestamp < props[id].deadlineAt, 'VOTING_ENDED');
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
        require(block.timestamp >= props[id].deadlineAt, 'NOT_ENDED');
        require(!finalized[id], 'FINALIZED');

        uint256 total = uint256(yesVotes[id]) + uint256(noVotes[id]);
        bool majority = yesVotes[id] > noVotes[id];
        bool quorumOk = (minVotesPercent == 0)
            ? true
            : (props[id].quorumBase > 0 &&
                total * 100 >= minVotesPercent * uint256(props[id].quorumBase));

        passed[id] = majority && quorumOk;
        finalized[id] = true;
        emit Finalized(id, passed[id]);

        // if (passed[id]) {
        //     if (props[id].ptype == ProposalType.ConfigChange) {
        //         _setConfig(props[id].newBps, props[id].newSecs);
        //     } else if (props[id].ptype == ProposalType.Immigration) {
        //         _addCitizen(props[id].target);
        //     }
        // }
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

    // function implement(uint256 id) external {
    //     require(id < nextId, "NO_SUCH_PROPOSAL");
    //     require(passed[id], "NOT_PASSED");
    //     require(!implemented[id], "ALREADY_IMPLEMENTED");
    //     implemented[id] = true;

    //     address who = props[id].target;
    //     require(who != address(0), "NO_TARGET");
    //     registry.addCitizen(who);

    //     emit Implemented(id, who);
    // }
}
