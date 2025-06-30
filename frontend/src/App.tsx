import { useAccount } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import Governor from "./components/Governor";
import GovernorsProposalList from "./components/GovernorsProposalList";
import ContractProposals from "./components/ContractProposals";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <>
          <>Current account: </>
          <>{CONTRACT_ADDRESS}</>
          <Governor address={CONTRACT_ADDRESS} />
          <GovernorsProposalList address={CONTRACT_ADDRESS} />
          <ContractProposals address={CONTRACT_ADDRESS} />
        </>
      ) : (
        <ConnectButton />
      )}
    </>
  );
}
