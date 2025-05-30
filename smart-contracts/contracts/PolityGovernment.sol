// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PolityGovernment {
    address[] public signers;
    uint256 public requiredSignatures;
    mapping(address => bool) public hasSigned;
    uint256 public totalSignatures;

    bool public upgradeApproved;
    address public newImplementation;

    event UpgradeApproved(address indexed newImplementation);
    event UpgradeTriggered(address indexed newImplementation);

    // modifier onlySigner() {
    //     require(isSigner(msg.sender), "Not a signer");
    //     _;
    // }

    constructor(address[] memory _signers, uint256 _requiredSignatures) {
        require(_signers.length >= _requiredSignatures, "Too few signers");
        signers = _signers;
        requiredSignatures = _requiredSignatures;
    }

    // function isSigner(address _address) public view returns (bool) {
    //     for (uint256 i = 0; i < signers.length; i++) {
    //         if (_address == signers[i]) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // Function for signers to approve the upgrade
    // function approveUpgrade(address _newImplementation) public onlySigner {
    //     require(!hasSigned[msg.sender], "Signer has already approved");

    //     // Mark the address as having signed
    //     hasSigned[msg.sender] = true;
    //     totalSignatures += 1;

    //     // If enough signers have approved, set the upgrade as approved
    //     if (totalSignatures >= requiredSignatures) {
    //         upgradeApproved = true;
    //         newImplementation = _newImplementation;
    //         emit UpgradeApproved(newImplementation);
    //     }
    // }
}
