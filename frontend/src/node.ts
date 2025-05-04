// For faster implementation, start the server without docker currently
// In the future, for other non tech users to join, should use docker to wrap the image
// yarn build
// LIBP2P_PORT=15000 CREDENTIAL="test" node dist/node.js
// LIBP2P_PORT=16000 CREDENTIAL="test1" node dist/node.js
// LIBP2P_PORT=17000 CREDENTIAL="test" node dist/node.js

import {
  makeNode,
  sendIdentityCredential,
  verifyIdentityCredential,
} from "./services/node";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.LIBP2P_PORT) || 15000;
const topic = process.env.TOPIC || "no-topic";
const node = await makeNode(topic, port);
const acceptedPeers = new Set<string>();

node.addEventListener("peer:discovery", async (evt) => {
  try {
    const peerId = evt.detail.id;
    console.log("Discovered peer:", peerId.toString());
    await sendIdentityCredential(node, peerId);
  } catch (err) {
    console.error("Dial error:", err);
  }
});

// There should be different identifications
// This one only on the versions first
node.handle("/identity/1.0.0", async ({ stream, connection }) => {
  console.log("Incoming stream for identity check");
  const peerId = connection.remotePeer;
  const verified = await verifyIdentityCredential(
    acceptedPeers,
    stream,
    peerId,
  );
  console.log(acceptedPeers);
  if (!verified) {
    node.hangUp(peerId);
  }
});
