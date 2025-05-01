import { makeNode } from "../src/services/node";

test("makeNode creates and starts a libp2p node", async () => {
  const node = await makeNode(15000);
  expect(node).toBeDefined();
  expect(node.getMultiaddrs().length).toBeGreaterThan(0);
  await node.stop();
});
