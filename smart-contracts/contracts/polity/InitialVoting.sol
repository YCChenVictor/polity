// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InitialVoting {
    struct Proposal {
        address target;
        uint256 value;
        bytes data;
        string description;
        uint40 start;
        uint40 end;
        uint32 yes;
        uint32 no;
    }

    uint256 public immutable minVotesPercent; // 0–100
    mapping(uint256 => Proposal) public props;
    mapping(uint256 => mapping(address => bool)) public voted;
    uint256 public nextId;

    event Proposed(
        uint256 id,
        address target,
        uint256 value,
        bytes data,
        string description,
        uint40 start,
        uint40 end
    );
    event Voted(uint256 id, address voter, bool support);

    constructor(uint256 _minVotesPercent) {
        require(_minVotesPercent <= 100, 'PERCENT_TOO_HIGH');
        minVotesPercent = _minVotesPercent;
    }

    function propose(
        address target,
        uint256 value,
        bytes calldata data,
        string calldata description,
        uint40 votingPeriod
    ) external returns (uint256 id) {
        require(votingPeriod > 0, 'PERIOD=0');
        id = nextId++;
        props[id] = Proposal({
            target: target,
            value: value,
            data: data,
            description: description,
            start: uint40(block.timestamp),
            end: uint40(block.timestamp) + votingPeriod,
            yes: 0,
            no: 0
        });
        emit Proposed(id, target, value, data, description, props[id].start, props[id].end);
    }

    // function vote(uint256 id, bool support) external {
    //     Proposal storage p = props[id];
    //     require(block.timestamp >= p.start && block.timestamp < p.end, "NOT_VOTING");
    //     require(!voted[id][msg.sender], "ALREADY");
    //     voted[id][msg.sender] = true;
    //     if (support) p.yes++; else p.no++;
    //     emit Voted(id, msg.sender, support);
    // }

    // // Pass totalEligible (e.g., citizen count) from your registry/manager.
    // function result(uint256 id, uint256 totalEligible)
    //     external
    //     view
    //     returns (bool passed, uint32 yes, uint32 no)
    // {
    //     Proposal storage p = props[id];
    //     yes = p.yes; no = p.no;
    //     if (block.timestamp < p.end) return (false, yes, no);
    //     if (totalEligible == 0) return (false, yes, no); // avoid div-by-0

    //     uint256 votes = uint256(yes) + uint256(no);
    //     bool quorum = votes * 100 >= totalEligible * minVotesPercent; // % check
    //     passed = quorum && yes > no;
    // }
}
