// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

import {Vote} from "../src/Vote.sol";
import {Citizen} from "../src/Citizen.sol";
import {Agora} from "../src/Agora.sol";
import {Reward} from "../src/Reward.sol";

contract DeployPolity is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        // 1) GOV token (ERC20Votes)
        uint256 totalSupply = 1_000_000e18;
        Vote vote = new Vote(deployer, totalSupply);

        // 2) Citizen (UUPS proxy)
        Citizen citizenImpl = new Citizen();
        bytes memory citizenInitData = abi.encodeCall(
            Citizen.initialize,
            (deployer) // initialOwner = deployer, will hand over to timelock
        );
        ERC1967Proxy citizenProxy = new ERC1967Proxy(
            address(citizenImpl),
            citizenInitData
        );
        Citizen citizen = Citizen(address(citizenProxy));

        // 3) Timelock
        uint256 minDelay = 2 days;
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);

        TimelockController timelock = new TimelockController(
            minDelay,
            proposers,
            executors,
            deployer
        );

        // Citizen owned by timelock
        citizen.transferOwnership(address(timelock));

        // 4) Agora (Governor, UUPS proxy) No UUPS now
        Agora agora = new Agora(vote, address(citizen));
        // bytes memory agoraInitData = abi.encodeCall(
        //     Agora.initialize,
        //     (IVotes(address(vote)), address(citizen))
        // );
        // ERC1967Proxy agoraProxy = new ERC1967Proxy( // The real agora implementation
        //     address(agoraImpl),
        //     agoraInitData
        // );
        // Agora agora = Agora(payable(address(agoraProxy)));

        // wire Agora into timelock
        bytes32 PROPOSER_ROLE = timelock.PROPOSER_ROLE();
        bytes32 ADMIN_ROLE    = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(PROPOSER_ROLE, address(agora));
        timelock.revokeRole(ADMIN_ROLE, deployer);

        // 5) Reward: holds GOV and can pay contributors
        // owner = timelock so only governance can call rewardContributor
        Reward rewards = new Reward(address(vote), address(timelock));

        // fund rewards pool with some GOV (deployer is still Vote.owner())
        uint256 rewardPool = 100_000e18;
        vote.transfer(address(rewards), rewardPool);

        // optional but recommended: put Vote under timelock too
        vote.transferOwnership(address(timelock));

        vm.stopBroadcast();
    }
}
