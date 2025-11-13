// Run:
// export PRIVATE_KEY=<your_key>
// forge script scripts/DeployPolity.s.sol:DeployPolity --rpc-url http://127.0.0.1:8545 --broadcast -vv
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {Vote} from "../src/Vote.sol";
import {CitizenRegistry} from "../src/CitizenRegistry.sol";
import {Agora} from "../src/Agora.sol";
import {LawRegistry} from "../src/LawRegistry.sol";

contract DeployPolity is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        uint256 mintAmount = vm.envOr("MINT", uint256(1_000_000 ether));
        bytes memory lawCidBytes = vm.envBytes("LAW_CID_BYTES");
        bytes32 lawSha256        = vm.envBytes32("LAW_SHA256");
        string memory lawMime    = vm.envOr("LAW_MIME", string("text/markdown"));

        vm.startBroadcast(pk);

        Vote vote = new Vote();
        vote.mint(deployer, mintAmount);
        vote.delegate(deployer);

        CitizenRegistry citizen = new CitizenRegistry();
        Agora agora = new Agora(vote);
        LawRegistry law = new LawRegistry(lawCidBytes, lawSha256, lawMime);

        vm.stopBroadcast();

        console2.log("Deployer:", deployer);
        console2.log("Vote:    ", address(vote));
        console2.log("Citizen: ", address(citizen));
        console2.log("Agora:   ", address(agora));
        console2.log("Law:     ", address(law));
    }
}
