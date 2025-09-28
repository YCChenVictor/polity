// ignition/modules/DeployModule.ts
// npx hardhat ignition deploy ignition/modules/polity.ts --network localhost
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PolityModule", (m) => {
  const vote = m.contract("Vote");

  const deployer = m.getAccount(0);
  const mintAmount = m.getParameter("mintAmount", 1_000_000n * 10n ** 18n);

  m.call(vote, "mint", [deployer, mintAmount]);
  m.call(vote, "delegate", [deployer]);

  const citizen = m.contract("Citizen");
  const poll = m.contract("Poll", [vote]);

  return { vote, citizen, poll };
});
