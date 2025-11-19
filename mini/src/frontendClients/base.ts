import { connect, getAccount } from "@wagmi/core";
import { injected } from "@wagmi/connectors";

import wagmiConfig from "../wagmiConfig";

const ensureAccount = async () => {
  const acc = getAccount(wagmiConfig);
  if (acc.status === "connected" && acc.address) return acc.address;

  const { accounts } = await connect(wagmiConfig, {
    connector: injected({ shimDisconnect: true }),
  });
  return accounts[0];
}

export { ensureAccount } 
