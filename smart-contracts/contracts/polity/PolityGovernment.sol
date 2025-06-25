// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';

interface IUUPS {
    function upgradeTo(address newImplementation) external;
}

contract PolityGovernment {
    address[] public governors;
    uint256 public requiredSignatures;

    mapping(address => bool) public hasSigned;
    uint256 public totalSignatures;

    address public proxyA;
    address public pendingImplA;
    bool public upgradeApprovedA;

    event GovernorProposalCreated(uint256 indexed proposalId, address proposed);
    event GovernorAdded(address indexed newGovernor);
    event UpgradeApproved(address indexed newImplementation);
    event UpgradeTriggered(address indexed newImplementation);

    modifier onlyGovernor() {
        require(isGovernor(msg.sender), 'Not a governor');
        _;
    }

    // We now directly have a pre-defined proxy A. In the future, we need a mechanism to add list of contracts
    constructor(address[] memory _governors, uint256 _requiredSignatures, address _proxyA) {
        require(_governors.length >= _requiredSignatures, 'Too few governors');
        governors = _governors;
        requiredSignatures = _requiredSignatures;
        proxyA = _proxyA;
    }

    // CRUD of governors
    function addGovernor(address newGovernor) public onlyGovernor {
        require(!isGovernor(newGovernor), 'Already a signer');
        governors.push(newGovernor);
    }

    function getGovernors() public view returns (address[] memory) {
        return governors;
    }

    function isGovernor(address _addr) public view returns (bool) {
        for (uint i = 0; i < governors.length; i++) {
            if (governors[i] == _addr) return true;
        }
        return false;
    }

    // ===== GOVERNOR PROPOSAL SYSTEM =====
    struct AddGovernorProposal {
        address proposed;
        uint256 votes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => AddGovernorProposal) public addGovernorProposals;
    uint256 public addGovernorProposalCount;

    function proposeAddGovernor(address newGovernor) public onlyGovernor {
        uint256 id = addGovernorProposalCount++;
        AddGovernorProposal storage prop = addGovernorProposals[id];
        prop.proposed = newGovernor;
        emit GovernorProposalCreated(id, newGovernor);
    }

    function listAddGovernorProposals()
        external
        view
        returns (address[] memory proposeds, uint256[] memory votesArr, bool[] memory executedArr)
    {
        uint256 n = addGovernorProposalCount;
        proposeds = new address[](n);
        votesArr = new uint256[](n);
        executedArr = new bool[](n);

        for (uint256 i = 0; i < n; i++) {
            AddGovernorProposal storage p = addGovernorProposals[i];
            proposeds[i] = p.proposed;
            votesArr[i] = p.votes;
            executedArr[i] = p.executed;
        }
    }

    function approveUpgrade(address _newImpl) public onlyGovernor {
        require(!hasSigned[msg.sender], 'Already approved');

        hasSigned[msg.sender] = true;
        totalSignatures++;

        if (totalSignatures >= requiredSignatures) {
            upgradeApprovedA = true;
            pendingImplA = _newImpl;
            emit UpgradeApproved(_newImpl);
        }
    }

    function triggerUpgrade() public {
        require(upgradeApprovedA, 'Not approved');
        // This is the method to upgrade UUPS contract.
        // It will trigger the upgradeTo in the UUPS contract itself
        IUUPS(proxyA).upgradeTo(pendingImplA); // Now we explicitly set only A contract
        emit UpgradeTriggered(pendingImplA);

        upgradeApprovedA = false;
        pendingImplA = address(0);
        totalSignatures = 0;
        for (uint i = 0; i < governors.length; i++) {
            hasSigned[governors[i]] = false;
        }
    }
}
