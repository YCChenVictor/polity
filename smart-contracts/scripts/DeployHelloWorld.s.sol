// Run:
// export DEPLOYER_PRIVATE_KEY=<your_key>
// forge script scripts/DeployHelloWorld.s.sol:DeployHelloWorld --rpc-url http://127.0.0.1:8545 --broadcast -vv

import "forge-std/Script.sol";

import {HelloWorld} from "../src/HelloWorld.sol"; 

contract DeployHelloWorld is Script {
    // external: This function is callable from the outside world (and therefore appears in the ABI).
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(pk);

        new HelloWorld();

        vm.stopBroadcast();
    }
}
