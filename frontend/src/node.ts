// // For faster implementation, start the server without docker currently
// // In the future, for other non tech users to join, should use docker to wrap the image
// // yarn build
// // LIBP2P_PORT=15000 CREDENTIAL="test" node dist/node.js
// // LIBP2P_PORT=16000 CREDENTIAL="test1" node dist/node.js
// // LIBP2P_PORT=17000 CREDENTIAL="test" node dist/node.js

// import { createAndStartNode } from "./services/node";

// const CREDENTIAL = process.env.CREDENTIAL;
// if (!CREDENTIAL) {
//   throw new Error("Environment variable CREDENTIAL must be set");
// }
// const PORT = Number(process.env.PORT);
// const TOPIC = process.env.TOPIC ?? "default-topic";
// const acceptedPeers = new Set("");

// createAndStartNode(PORT, TOPIC, CREDENTIAL, acceptedPeers).catch(
//   (err: unknown) => {
//     console.log("Failed to start libp2p node: %o", err);
//     process.exit(1);
//   },
// );
