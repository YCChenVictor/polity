import Create from "./events/Create";
import List from "./events/List";

function Topic({ pollAddress }: { pollAddress: `0x${string}` }) {
  return (
    <>
      <Create />
      <List pollAddress={pollAddress} />
    </>
  );
}

export default Topic;
