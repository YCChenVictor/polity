import { connect, getAccount } from "@wagmi/core";
import { injected } from "@wagmi/connectors";

import wagmiConfig from "../wagmiConfig";

const mode = import.meta.env.MODE ?? "development";
const isTest = mode === "test";

export const TEST_ACCOUNT =
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" as `0x${string}`;

const ensureAccount = async () => {
  if (isTest) {
    return TEST_ACCOUNT;
  }

  const acc = getAccount(wagmiConfig);
  if (acc.status === "connected" && acc.address) return acc.address;

  const { accounts } = await connect(wagmiConfig, {
    connector: injected({ shimDisconnect: true }),
  });
  return accounts[0];
}

export { ensureAccount } 
