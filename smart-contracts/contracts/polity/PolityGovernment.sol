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

    function addGovernor(address newGovernor) public onlyGovernor {
        require(!isGovernor(newGovernor), 'Already a signer');
        governors.push(newGovernor);
    }

    function isGovernor(address _addr) public view returns (bool) {
        for (uint i = 0; i < governors.length; i++) {
            if (governors[i] == _addr) return true;
        }
        return false;
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
