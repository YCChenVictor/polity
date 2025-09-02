import List from "./citizens/List";

function Citizen({ citizenAddress }: { citizenAddress: `0x${string}` }) {
  return (
    <div>
      <List address={citizenAddress} />
    </div>
  );
}

export default Citizen;
