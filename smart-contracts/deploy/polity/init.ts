// ignition/modules/DeployModule.ts
// npx hardhat ignition deploy ignition/modules/DeployModule.ts --network sepolia
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployModule", (m) => {
  const citizen = m.contract("Citizen");
  const poll = m.contract("Poll", [citizen, 51, 10]);
  return { citizen, poll };
});
