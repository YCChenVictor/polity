// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Poll {
    struct Proposal {
        string content;
    }

    struct View {
        uint256 id;
        string content;
        uint32 yes;
        uint32 no;
    }

    uint256 public immutable minVotesPercent; // 0–100 (kept for future logic)
    mapping(uint256 => Proposal) public props;
    mapping(uint256 => mapping(address => bool)) public voted;
    mapping(uint256 => uint32) public yesVotes;
    mapping(uint256 => uint32) public noVotes;
    uint256 public nextId;

    event Proposed(uint256 id, string content);
    event Voted(uint256 id, address voter, bool support);

    constructor(uint256 _minVotesPercent) {
        require(_minVotesPercent <= 100, 'PERCENT_TOO_HIGH');
        minVotesPercent = _minVotesPercent;
    }
    function create(string calldata content) external returns (uint256 id) {
        require(bytes(content).length != 0, 'EMPTY_CONTENT');
        id = nextId++;
        Proposal storage p = props[id];
        p.content = content; // copies from calldata -> storage once
        emit Proposed(id, content);
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
        require(!voted[id][msg.sender], 'ALREADY_VOTED');
        voted[id][msg.sender] = true;

        if (support) {
            yesVotes[id] += 1;
        } else {
            noVotes[id] += 1;
        }
        emit Voted(id, msg.sender, support);
    }
}
