// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './BillProposalSystem.sol';
import './CodeProposalSystem.sol';

interface ICitizenRegistry {
    struct Citizen {
        uint8 reasonCode;
        address wallet;
    }

    function createCitizen(address wallet, uint8 reasonCode) external;
    function isCitizen(address wallet) external view returns (bool);
    function readCitizens() external view returns (Citizen[] memory);
}

interface IProposeGovernor {
    struct ProposedGovernor {
        address proposed;
        uint256 votes;
        bool executed;
    }

    function proposeGovernor(address wallet) external;
    function listGovernorProposals() external view returns (ProposedGovernor[] memory);
}

contract PolityGovernment {
    constructor() {}

    mapping(string => address) private modules;
    string[] private moduleNames;
    mapping(string => bool) private seen;
    event ModuleSet(string indexed name, address indexed oldImpl, address indexed newImpl);

    // ─────────────────────── Struct ───────────────────────

    struct GovernanceModuleView {
        string name;
        address moduleAddress;
    }

    function setModule(string calldata name, address impl) external {
        require(bytes(name).length != 0, 'EMPTY_NAME');
        require(impl != address(0), 'ZERO_ADDR');
        address old = modules[name];
        modules[name] = impl;
        if (!seen[name]) {
            moduleNames.push(name);
            seen[name] = true;
        }
        emit ModuleSet(name, old, impl);
    }

    function listGovernanceModules() external view returns (GovernanceModuleView[] memory views) {
        // return only active (non-zero) modules
        uint n = 0;
        for (uint i = 0; i < moduleNames.length; i++)
            if (modules[moduleNames[i]] != address(0)) n++;
        views = new GovernanceModuleView[](n);
        uint k = 0;
        for (uint i = 0; i < moduleNames.length; i++) {
            address a = modules[moduleNames[i]];
            if (a != address(0)) {
                views[k++] = GovernanceModuleView(moduleNames[i], a);
            }
        }
        return views;
    }

    // ─────────────────────── Voting Modules ───────────────────────
    // Directly read the method from voting module address
    // function propose() external {
    //     // Going to release the constraint Voting later
    //     require(modules['voting'] != address(0), 'Voting Mechanism not set');
    //     return IVoting(modules['voting']).propose();
    // }

    // function listProposals() external view returns (IVoting.ProposalView[] memory views) {
    //     address v = modules['voting'];
    //     require(v != address(0), 'Voting Mechanism not set');
    //     return IVoting(v).listProposals();
    // }

    // ─────────────────────── Citizen Modules ───────────────────────
    // address public citizenRegistry;

    // function createCitizen(address wallet, uint8 reasonCode) external {
    //     require(citizenRegistry != address(0), 'Citizen Registry Module not set');
    //     ICitizenRegistry(citizenRegistry).createCitizen(wallet, reasonCode);
    // }

    // function readCitizens() external view returns (ICitizenRegistry.Citizen[] memory) {
    //     require(citizenRegistry != address(0), 'Citizen Registry Module not set');
    //     return ICitizenRegistry(citizenRegistry).readCitizens();
    // }

    // ─────────────────────── Citizen Modules ───────────────────────
    // address public governorProposalSystem;

    // function setGovernorProposalSystem(address _addr) external onlyGovernor {
    //     governorProposalSystem = _addr;
    // }

    // function proposeGovernor(address newGovernor) external {
    //     require(governorProposalSystem != address(0), 'Governor Proposal Module not set');
    //     IProposeGovernor(governorProposalSystem).proposeGovernor(newGovernor);
    // }

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
        require(!isLawLevel[level], 'Exists');
        lawLevels.push(level);
        isLawLevel[level] = true;
        emit LawLevelAdded(level);
    }

    function getLawLevels() external view returns (string[] memory) {
        return lawLevels;
    }
}
