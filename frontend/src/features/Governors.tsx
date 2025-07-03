import Create from "./governors/GovernorCreate";
import List from "./governors/GovernorList";

function governors({ address }: { address: `0x${string}` }) {
  return (
    <>
      <Create address={address} />
      <List address={address} />
    </>
  );
}

export default governors;
