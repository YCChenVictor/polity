// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Upgradeable1.sol";

contract Upgradeable2 is Upgradeable1 {
    function mintMore(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
