import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";
import { upgradeable1Abi } from "./generated";
import { createWalletClient } from "viem";
import { useEffect } from "react";
import { watchContractEvent } from "@wagmi/core";

const queryClient = new QueryClient();

const hardhat = defineChain({
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Hardhat Explorer", url: "" },
  },
  testnet: true,
});

const config = createConfig({
  connectors: [injected()],
  transports: {
    [hardhat.id]: http(),
  },
  chains: [hardhat],
});

const walletClient = createWalletClient({
  account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  chain: hardhat,
  transport: http(),
});

function ContractInteraction() {
  useEffect(() => {
    const unwatch = watchContractEvent(config, {
      address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      abi: upgradeable1Abi,
      eventName: "AlreadyTriedJoin",
      onLogs(logs) {
        logs.forEach((log) =>
          console.warn("⚠️ Already tried to join:", log.args.user),
        );
      },
    });

    return () => unwatch();
  }, []);

  const handleJoin = async () => {
    try {
      const txHash = await walletClient.writeContract({
        address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        abi: upgradeable1Abi,
        functionName: "join",
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      });
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleJoin}>Join</button>;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ContractInteraction />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
