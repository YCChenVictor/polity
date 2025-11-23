pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Reward is Ownable {
    /// @notice Governance token used for rewards (your Vote/GOV token)
    IERC20 public immutable govToken;

    constructor(address govToken_, address initialOwner) Ownable(initialOwner) {
        require(govToken_ != address(0), "govToken zero");
        govToken = IERC20(govToken_);
    }

    /// @notice Pay GOV tokens to a contributor. This contract must already hold enough govToken.
    function rewardContributor(address who, uint256 amount) external onlyOwner {
        require(who != address(0), "zero addr");
        require(amount > 0, "zero amount");
        govToken.transfer(who, amount);
    }
}
