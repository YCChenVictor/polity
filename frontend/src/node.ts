import { makeNode } from "./services/node";

const args = process.argv;
const port = Number(args[2]);
const node = await makeNode(port);
node.addEventListener("peer:discovery", (evt) => {
  console.log("Discovered peer:", evt.detail.id.toString());
});
