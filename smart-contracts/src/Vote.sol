// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

contract Vote is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() ERC20("GovToken", "GOV") ERC20Permit("GovToken") Ownable(msg.sender) {}

    /// @notice mint voting power (restrict as you need)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // ----- required overrides (OZ v5) -----
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
