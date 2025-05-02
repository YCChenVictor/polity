import { makeNode } from "./services/node";

const port = Number(process.env.LIBP2P_PORT) || 15000;
const node = await makeNode(port);
node.addEventListener("peer:discovery", (evt) => {
  console.log("Discovered peer:", evt.detail.id.toString());
});
