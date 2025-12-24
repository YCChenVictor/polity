import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

const rpcUrl = process.env.RPC_URL!;
if (!rpcUrl) throw new Error("Missing RPC_URL");

const pk = process.env.ATTESTOR_PRIVATE_KEY as `0x${string}` | undefined;
if (!pk) throw new Error("Missing ATTESTOR_PRIVATE_KEY");

const account = privateKeyToAccount(pk);

export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(rpcUrl),
});

export const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http(rpcUrl),
});
