import { createAndStartNode } from "../../src/services/node";

describe("createAndStartNode (integration)", () => {
  // let node: Libp2p;

  // afterEach(async () => {
  //   if (node?.stop) await node.stop();
  // });

  // it("should create and start a libp2p node", async () => {
  //   const port = 15000;
  //   const topic = "test-topic";
  //   const credential = "test-credential";
  //   const acceptedPeers = new Set<string>(["peer1"]);

  //   node = await createAndStartNode(port, topic, credential, acceptedPeers);

  //   expect(node).toBeDefined();
  //   expect(node.peerId).toBeDefined();
  //   expect(typeof node.peerId.toString()).toBe("string");
  //   expect(node.services.pubsub).toBeDefined();
  // });
  it(" xvczxczcvzx", async () => {
    const nodeA = await createAndStartNode(
      15001,
      "test-topic",
      "cred-A",
      new Set(),
    );
    await createAndStartNode(15002, "test-topic", "cred-B", new Set());

    await new Promise((res) => setTimeout(res, 1000)); // wait for discovery

    expect(nodeA.getPeers().length).toBeGreaterThan(0); // assuming you expose getPeers()
  });

  it(" xvczxczcvzx", async () => {
    const nodeA = await createAndStartNode(
      15003,
      "test-topic",
      "same-cred",
      new Set(),
    );
    await createAndStartNode(15004, "test-topic", "same-cred", new Set());

    await new Promise((res) => setTimeout(res, 1000)); // wait for discovery

    expect(nodeA.getPeers().length).toBeGreaterThan(0); // assuming you expose getPeers()
  });
});
