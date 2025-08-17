import Create from "./events/CreateEvent";
import List from "./events/ListEvents";

function Event({ governmentAddress }: { governmentAddress: `0x${string}` }) {
  return (
    <>
      <Create />
      <List governmentAddress={governmentAddress} />
    </>
  );
}

export default Event;
