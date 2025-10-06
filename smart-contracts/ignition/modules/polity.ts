// ignition/modules/DeployModule.ts
// npx hardhat ignition deploy ignition/modules/polity.ts --network localhost
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PolityModule", (m) => {
  const deployer = m.getAccount(0);
  const mintAmount = m.getParameter("mintAmount", 1_000_000n * 10n ** 18n);

  const vote = m.contract("Vote");
  m.call(vote, "mint", [deployer, mintAmount]);
  m.call(vote, "delegate", [deployer]);

  const citizen = m.contract("CitizenRegistry");
  const agora = m.contract("Agora", [vote]);

  return { vote, citizen, agora };
});
