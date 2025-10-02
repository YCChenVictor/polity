interface IAgora {
    enum ProposalType {
        ConfigChange,
        Immigration,
        Event
    }
    struct Proposal {
        uint256 id;
        ProposalType kind;
        address proposer;
        uint64 startBlock;
        uint64 endBlock;
    }
    function createCitizen(address newCitizenAddress) external;
    // function proposals(
    //     ProposalType proposalType,
    //     uint256 offset,
    //     uint256 limit
    // ) external view returns (Proposal[] memory);
    function hasPassed(address wallet) external view returns (bool);
}
