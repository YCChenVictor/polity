// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../contracts/PolityGovernment.sol";

contract PolityGovernmentTest is Test {
    PolityGovernment public polity;
    address public signer1;
    address public signer2;
    address public signer3;
    address public newImplementation;
    address[] public signers;

    function setUp() public {
        console.log("zxcvvzcxzvxc");
        signer1 = address(0x1);
        signer2 = address(0x2);
        signer3 = address(0x3);

        signers.push(signer1);
        signers.push(signer2);
        signers.push(signer3);

        polity = new PolityGovernment(signers, 2);
        newImplementation = address(0x4);
    }

    function testApproveUpgrade() public {
        console.log("testing");
    }
}
