// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './GovernorProposalSystem.sol';
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

contract PolityGovernment is
    BaseGovernance,
    GovernorProposalSystem,
    RuleProposalSystem,
    OffChainRuleProposalSystem
{
    constructor(uint256 _requiredSignatures) BaseGovernance(_requiredSignatures) {}

    // ─────────────────────── Struct ───────────────────────

    struct GovernanceModuleView {
        bytes32 name;
        address moduleAddress;
    }

    // ─────────────────────── Modules ───────────────────────

    address public citizenRegistry;

    function setCitizenRegistry(address _addr) external onlyGovernor {
        citizenRegistry = _addr;
    }

    function registerCitizen(address wallet) external onlyGovernor {
        require(citizenRegistry != address(0), 'Module not set');
        ICitizenRegistry(citizenRegistry).createCitizen(wallet);
    }

    function getCitizens() external view onlyGovernor returns (ICitizenRegistry.Citizen[] memory) {
        require(citizenRegistry != address(0), 'Module not set');
        return ICitizenRegistry(citizenRegistry).readCitizens();
    }

    function listGovernanceModules() external view returns (GovernanceModuleView[] memory views) {
        views = new GovernanceModuleView[](1);
        views[0] = GovernanceModuleView({
            name: 'CitizenRegistry',
            moduleAddress: citizenRegistry
        });
        return views;
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
