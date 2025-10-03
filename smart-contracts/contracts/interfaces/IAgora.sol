interface IAgora {
    enum ProposalType {
        Text,
        Target
    }
    function createCitizen(address target) external;
    function hasPassed(address wallet) external view returns (bool);
}
