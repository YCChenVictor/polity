pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Reward} from "../src/Reward.sol";

contract MockGovToken is ERC20 {
    constructor() ERC20("GovToken", "GOV") {
        _mint(msg.sender, 1_000_000e18);
    }
}

contract RewardTest is Test {
    MockGovToken govToken;
    Reward reward;

    address owner = address(this);
    address user = address(0xBEEF);

    function setUp() public {
        // deploy token, all supply to owner (this contract)
        govToken = new MockGovToken();

        // owner of WorkRewards = owner (for prod you’d pass timelock instead)
        reward = new Reward(address(govToken), owner);

        // fund rewards contract
        govToken.transfer(address(reward), 100_000e18);
    }

    function testRewardContributorTransfersTokens() public {
        uint256 amount = 1_000e18;

        vm.prank(owner);
        reward.rewardContributor(user, amount);

        assertEq(govToken.balanceOf(user), amount);
        assertEq(govToken.balanceOf(address(reward)), 100_000e18 - amount);
    }
}
