// src/client.ts (or src/client/helloClient.ts)
import { readContract } from "@wagmi/core";
import wagmiConfig from "./wagmiConfig";      // or "../wagmiConfig"
import { helloWorldAbi } from "./generated";  // adjust path if needed

const HELLO_WORLD_ADDRESS =
  (import.meta as any).env.VITE_HELLO_WORLD_ADDRESS as `0x${string}`;

export async function getGreeting(): Promise<string> {
  const result = await readContract(wagmiConfig, {
    address: HELLO_WORLD_ADDRESS,
    abi: helloWorldAbi,
    functionName: "getGreeting",
  });

  console.log(result);
  return result as string;
}

const createAgora = async () => {
  await writeContract({
      address: address,
      abi: pollAbi,
      functionName: "create",
      args: [context],
    });
}

export { createAgora };
