// import Create from "./topics/Create";
import CreateIPFS from "./topics/CreateIPFS";
// import List from "./topics/List";

function Topic() {
  return (
    <>
      <>
        Any person can send requests for our services. This is the concept to
        build virtuous government. As a result, the current topic will be around
        economics.
      </>
      <CreateIPFS />
      {/* <Create /> */}
      {/* <List pollAddress={pollAddress} /> */}
    </>
  );
}

export default Topic;
