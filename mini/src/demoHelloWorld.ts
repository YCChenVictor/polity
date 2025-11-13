// src/demoHelloWorld.ts
import { readContract } from "@wagmi/core";
import wagmiConfig from "./wagmiConfig";
import { helloWorldAbi } from "./generated";

const HELLO_WORLD_ADDRESS = "0xYourDeployedHelloWorld" as `0x${string}`;

// This function should be auto generate in the future
async function demo() {
  const greeting = await readContract(wagmiConfig, {
    address: HELLO_WORLD_ADDRESS,
    abi: helloWorldAbi,
    functionName: "getGreeting",
    // args: [] // none for this function
  });

  console.log("Greeting:", greeting);
}

demo().catch(console.error);
