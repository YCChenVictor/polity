// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import 'hardhat/console.sol';

contract TimocracyOld is Initializable, ERC20Upgradeable {
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply);
    }

    function join() external {
        _mint(msg.sender, 1);
    }

    function leave() external {
        require(balanceOf(msg.sender) >= 1, 'Not enough token to leave');
        _transfer(msg.sender, address(this), 1);
    }
}
