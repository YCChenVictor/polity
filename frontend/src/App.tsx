import { useAccount } from "wagmi";
import ConnectButton from "./components/ConnectButton";
import Governor from "./components/Governor";
import GovernorsProposalList from "./components/GovernorsProposalList";
import ContractProposals from "./components/ContractProposals";

export default function App({ address }: { address: `0x${string}` }) {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <>
          <>Current account: </>
          <>{address}</>
          <Governor address={address} />
          <GovernorsProposalList address={address} />
          <ContractProposals address={address} />
        </>
      ) : (
        <ConnectButton />
      )}
    </>
  );
}
