// Run: forge script scripts/DeployPolity.s.sol:DeployPolity --rpc-url http://127.0.0.1:8545 --broadcast -vv
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {Vote} from "../src/polity/Vote.sol";
import {CitizenRegistry} from "../src/polity/CitizenRegistry.sol";
import {Agora} from "../src/polity/Agora.sol";

contract DeployPolity is Script {
    function run() external {
        // 1) Load deployer key & config
        uint256 pk = vm.envUint("PRIVATE_KEY");                 // required
        address deployer = vm.addr(pk);
        uint256 mintAmount = vm.envOr("MINT", uint256(1_000_000 ether));

        // 2) Broadcast deployments + calls
        vm.startBroadcast(pk);

        Vote vote = new Vote();
        vote.mint(deployer, mintAmount);
        vote.delegate(deployer);

        CitizenRegistry citizen = new CitizenRegistry();
        Agora agora = new Agora(vote);

        vm.stopBroadcast();

        // 3) Log addresses
        console2.log("Deployer:", deployer);
        console2.log("Vote:    ", address(vote));
        console2.log("Citizen: ", address(citizen));
        console2.log("Agora:   ", address(agora));
    }
}
