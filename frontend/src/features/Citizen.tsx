import List from "./citizens/List";
import Create from "./citizens/Create";

function Citizen({ citizenAddress }: { citizenAddress: `0x${string}` }) {
  return (
    <div>
      <Create address={citizenAddress} />
      <List address={citizenAddress} />
    </div>
  );
}

export default Citizen;
