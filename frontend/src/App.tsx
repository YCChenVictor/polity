import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";
import { upgradeable1Abi } from "./generated";
import { createWalletClient } from "viem";

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
  const handleJoin = async () => {
    try {
      const txHash = await walletClient.writeContract({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
