import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// deploy: npx hardhat ignition deploy ignition/modules/TaskManager.ts --network localhost
const TaskManagerModule = buildModule("TaskManagerModule", (m) => {
  const token = m.contract("TaskManager", []);

  return { token };
});

export default TaskManagerModule;
