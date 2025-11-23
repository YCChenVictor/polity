pragma solidity ^0.8.25;

import "forge-std/Script.sol";

import {Vote} from "../src/Vote.sol";
import {Citizen} from "../src/Citizen.sol";
import {Agora} from "../src/Agora.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract DeployPolity is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        // 0) Deploy Vote token and give deployer voting power
        uint256 mintAmount = 1_000_000e18; // adjust as you like
        Vote vote = new Vote();
        vote.mint(deployer, mintAmount);
        vote.delegate(deployer);

        // 1) Citizen (UUPS-style behind ERC1967Proxy)
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

        // 2) Timelock
        uint256 minDelay = 2 days;
        
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);

        TimelockController timelock = new TimelockController(
            minDelay,
            proposers,
            executors,
            deployer // temporary admin
        );

        // 3) Transfer Citizen owner -> Timelock (Then only this timelock can call some onlyOwner function)
        citizen.transferOwnership(address(timelock));

        // 4) Agora (Governor) as UUPS-style behind proxy
        Agora agoraImpl = new Agora();
        bytes memory agoraInitData = abi.encodeCall(
            Agora.initialize,
            (IVotes(address(vote)), address(citizen))
        );
        ERC1967Proxy agoraProxy = new ERC1967Proxy(
            address(agoraImpl),
            agoraInitData
        );
        Agora agora = Agora(payable(address(agoraProxy)));

        // 5) Wire timelock roles
        bytes32 PROPOSER_ROLE = timelock.PROPOSER_ROLE();
        bytes32 ADMIN_ROLE    = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(PROPOSER_ROLE, address(agora));
        // executors already set to "anyone" via address(0)

        // best practice: drop your admin power
        timelock.revokeRole(ADMIN_ROLE, deployer);

        vm.stopBroadcast();
    }
}
