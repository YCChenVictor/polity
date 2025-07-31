// File: contracts/BaseGovernance.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseGovernance {
    address public deployer;
    address[] public governors;
    uint256 public requiredPercentage;

    constructor(uint256 _requiredPercentage) {
        deployer = msg.sender;
        if (!isGovernor(deployer)) governors.push(deployer); // Set the first government deployer as the first governor
        requiredPercentage = _requiredPercentage;
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

    function getRequiredSignatures() public view returns (uint256) {
        uint256 count = governors.length;
        return (count * requiredPercentage + 99) / 100; // round up
    }
}
