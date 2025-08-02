// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './BillProposalSystem.sol';
import './CodeProposalSystem.sol';

interface ICitizenRegistry {
    struct Citizen {
        address wallet;
    }

    function createCitizen(address wallet) external;
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

contract PolityGovernment is BaseGovernance, RuleProposalSystem, OffChainRuleProposalSystem {
    constructor(uint256 _requiredSignatures) BaseGovernance(_requiredSignatures) {}

    // ─────────────────────── Struct ───────────────────────

    struct GovernanceModuleView {
        string name;
        address moduleAddress;
    }

    // ─────────────────────── Modules ───────────────────────
    address public citizenRegistry;
    address public governorProposalSystem;

    function listGovernanceModules() external view returns (GovernanceModuleView[] memory views) {
        views = new GovernanceModuleView[](2);
        views[0] = GovernanceModuleView({
            name: 'CitizenRegistry',
            moduleAddress: citizenRegistry
        });
        views[1] = GovernanceModuleView({
            name: 'GovernorProposalSystem',
            moduleAddress: governorProposalSystem
        });
        return views;
    }

    function setCitizenRegistry(address _addr) external onlyGovernor {
        citizenRegistry = _addr;
    }

    function createCitizen(address wallet) external onlyGovernor {
        require(citizenRegistry != address(0), 'Citizen Registry Module not set');
        ICitizenRegistry(citizenRegistry).createCitizen(wallet);
    }

    function readCitizens() external view onlyGovernor returns (ICitizenRegistry.Citizen[] memory) {
        require(citizenRegistry != address(0), 'Citizen Registry Module not set');
        return ICitizenRegistry(citizenRegistry).readCitizens();
    }

    function setGovernorProposalSystem(address _addr) external onlyGovernor {
        governorProposalSystem = _addr;
    }

    function proposeGovernor(address newGovernor) external {
        require(governorProposalSystem != address(0), 'Governor Proposal Module not set');
        IProposeGovernor(governorProposalSystem).proposeGovernor(newGovernor);
    }

    function listGovernorProposals()
        external
        view
        onlyGovernor
        returns (IProposeGovernor.ProposedGovernor[] memory)
    {
        require(governorProposalSystem != address(0), 'Governor Proposal Module not set');
        return IProposeGovernor(governorProposalSystem).listGovernorProposals();
    }
    // ─────────────────────── Law Level ───────────────────────

    string[] public lawLevels;
    mapping(string => bool) public isLawLevel;
    event LawLevelAdded(string level);

    function addLawLevel(string memory level) external onlyGovernor {
        require(!isLawLevel[level], 'Exists');
        lawLevels.push(level);
        isLawLevel[level] = true;
        emit LawLevelAdded(level);
    }

    function getLawLevels() external view returns (string[] memory) {
        return lawLevels;
    }
}
