import { makeNode } from "../../src/services/node";

test("makeNode", async () => {
  const node = await makeNode("test", 15000);
  expect(node).toBeDefined();
  expect(node.getMultiaddrs().length).toBeGreaterThan(0);
  await node.stop();
});
