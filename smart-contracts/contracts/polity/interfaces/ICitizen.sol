interface ICitizen {
    function total() external view returns (uint256);
    function isCitizen(address) external returns (bool);
    function recordApprovedEvent(address proposer, string calldata cid) external;
}
