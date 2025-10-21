// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// interface ICitizen {
//     function total() external view returns (uint256);
// }

contract Government {
    // ICitizen public citizen;

    address public immutable poll;

    mapping(string => address) private modules;
    mapping(string => bool) private seen;
    string[] private moduleNames;

    event ModuleSet(string indexed name, address oldImpl, address newImpl);

    struct GovernanceModuleView {
        string name;
        address moduleAddress;
    }

    constructor(address citizen_) {
        // default, we need citizen and poll
        _set("citizen", citizen_);
        // citizen = ICitizen(citizen_);
    }

    // So you need the poll module first
    modifier onlyThroughPoll() {
        require(msg.sender == poll, "NOT_POLL");
        _;
    }

    function setModule(string calldata name, address impl) external onlyThroughPoll {
        require(bytes(name).length != 0, "EMPTY_NAME");
        require(impl != address(0) && impl.code.length > 0, "BAD_IMPL");
        _set(name, impl);
    }

    function getModule(string calldata name) external view returns (address) {
        return modules[name];
    }

    function listModuleNames() external view returns (string[] memory) {
        return moduleNames;
    }

    function listGovernanceModules() external view returns (GovernanceModuleView[] memory views) {
        uint256 n = moduleNames.length;
        views = new GovernanceModuleView[](n);
        for (uint256 i = 0; i < n; i++) {
            string memory nm = moduleNames[i];
            views[i] = GovernanceModuleView(nm, modules[nm]);
        }
    }

    // ---- citizen ----
    function totalCitizens() external view returns (uint256) {
        // return citizen.total();
    }

    // ---- internal ----
    function _set(string memory name, address impl) internal {
        address old = modules[name];
        modules[name] = impl;
        if (!seen[name]) {
            seen[name] = true;
            moduleNames.push(name);
        }
        emit ModuleSet(name, old, impl);
    }

    // function listGovernorProposals()
    //     external
    //     view
    //     onlyGovernor
    //     returns (IProposeGovernor.ProposedGovernor[] memory)
    // {
    //     require(governorProposalSystem != address(0), 'Governor Proposal Module not set');
    //     return IProposeGovernor(governorProposalSystem).listGovernorProposals();
    // }

    // ─────────────────────── Law Level ───────────────────────
    string[] public lawLevels;
    mapping(string => bool) public isLawLevel;

    event LawLevelAdded(string level);

    function addLawLevel(string memory level) public {
        require(!isLawLevel[level], "Exists");
        lawLevels.push(level);
        isLawLevel[level] = true;
        emit LawLevelAdded(level);
    }

    function getLawLevels() external view returns (string[] memory) {
        return lawLevels;
    }
}
