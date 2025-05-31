// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';

interface IUUPS {
    function upgradeTo(address newImplementation) external;
}

contract PolityGovernment {
    address[] public signers;
    uint256 public requiredSignatures;

    mapping(address => bool) public hasSigned;
    uint256 public totalSignatures;

    address public proxyA;
    address public pendingImplA;
    bool public upgradeApprovedA;

    event UpgradeApproved(address indexed newImplementation);
    event UpgradeTriggered(address indexed newImplementation);

    modifier onlySigner() {
        require(isSigner(msg.sender), 'Not a signer');
        _;
    }

    // We now directly have a pre-defined proxy A. In the future, we need a mechanism to add list of contracts
    constructor(address[] memory _signers, uint256 _requiredSignatures, address _proxyA) {
        require(_signers.length >= _requiredSignatures, 'Too few signers');
        signers = _signers;
        requiredSignatures = _requiredSignatures;
        proxyA = _proxyA;
    }

    function isSigner(address _addr) public view returns (bool) {
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == _addr) return true;
        }
        return false;
    }

    function approveUpgrade(address _newImpl) public onlySigner {
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
        for (uint i = 0; i < signers.length; i++) {
            hasSigned[signers[i]] = false;
        }
    }
}
