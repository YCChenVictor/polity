// File: contracts/BaseGovernance.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseGovernance {
    address[] public governors;
    uint256 public requiredSignatures;

    constructor(uint256 _requiredSignatures) {
        if (!isGovernor(msg.sender)) governors.push(msg.sender);
        requiredSignatures = _requiredSignatures;
    }

    // Create
    function addGovernor(address newGovernor) public onlyGovernor {
        require(!isGovernor(newGovernor), 'Already a governor');
        governors.push(newGovernor);
    }

    // Read
    function getGovernors() public view returns (address[] memory) {
        return governors;
    }

    // Update

    // Delete

    // hooks
    modifier onlyGovernor() {
        require(isGovernor(msg.sender), 'Not a governor');
        _;
    }

    function isGovernor(address addr) public view returns (bool) {
        for (uint256 i = 0; i < governors.length; i++) {
            if (governors[i] == addr) return true;
        }
        return false;
    }
}
