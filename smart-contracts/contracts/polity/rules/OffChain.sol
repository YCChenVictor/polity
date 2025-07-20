// File: PolityGovernment.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OffChain {
    string public bill;

    constructor(string memory initialBill) {
        bill = initialBill;
    }

    function setBill(string memory newBill) external {
        bill = newBill;
    }
}
