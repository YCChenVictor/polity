import { useAccount } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import Governor from "./components/Governor";
import ProposalList from "./components/ProposalList";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <>
          <Governor address={CONTRACT_ADDRESS} />
          <ProposalList address={CONTRACT_ADDRESS} />
        </>
      ) : (
        <ConnectButton />
      )}
    </>
  );
}
