import { createLibp2p, Libp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { mdns } from "@libp2p/mdns";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { gossipsub, GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { Identify, identify } from "@libp2p/identify";
import { PubSub, PeerInfo, IncomingStreamData } from "@libp2p/interface";

function createHandleIdentity(credential: string, acceptedPeers: Set<string>) {
  return async function handleIdentity({
    stream,
    connection,
  }: IncomingStreamData) {
    console.log(
      "Incoming identity-check stream from %s",
      connection.remotePeer.toString(),
    );

    const decoder = new TextDecoder();
    let received = "";

    try {
      for await (const chunk of stream.source) {
        received += decoder.decode(chunk.subarray(), { stream: true });
      }

      if (received === credential) {
        acceptedPeers.add(connection.remotePeer.toString());
        console.log(
          "Peer %s accepted. Total accepted: %d",
          connection.remotePeer,
          acceptedPeers.size,
        );
      } else {
        console.log(
          "Peer %s provided invalid credential",
          connection.remotePeer,
        );
      }
    } catch (err) {
      console.log(
        "Error processing identity stream from %s: %o",
        connection.remotePeer,
        err,
      );
    } finally {
      try {
        await stream.close();
      } catch (e) {
        console.log("Error closing identity stream: %o", e);
      }
    }
  };
}

async function handlePeerDiscovery(
  credential: string,
  node: Libp2p<{ pubsub: PubSub<GossipsubEvents>; identify: Identify }>,
  evt: CustomEvent<PeerInfo>,
) {
  const peerId = evt.detail.id;
  console.log("Discovered peer %s", peerId.toString());

  // Check if the peer supports our “identity” protocol
  const protocols = await node.getProtocols();
  if (!protocols.includes("identity")) {
    console.log(
      'Peer %s does not support "identity" protocol; skipping',
      peerId,
    );
    return;
  }

  let stream;
  try {
    stream = await node.dialProtocol(peerId, "identity");
    const encoder = new TextEncoder();
    const data = encoder.encode(credential);
    await stream.sink([data]);
    console.log("Sent credential to %s", peerId);
  } catch (err) {
    console.log("Failed to dial/send credential to %s: %o", peerId, err);
  } finally {
    if (stream) {
      try {
        await stream.close();
      } catch {
        /* empty */
      }
    }
  }
}

async function createAndStartNode(
  port: number,
  topic: string,
  credential: string,
  acceptedPeers: Set<string>,
) {
  const node = await createLibp2p({
    transports: [tcp()],
    connectionEncrypters: [noise()],
    streamMuxers: [mplex()],
    addresses: {
      listen: [`/ip4/127.0.0.1/tcp/${port}`],
    },
    peerDiscovery: [mdns(), pubsubPeerDiscovery({ topics: [topic] })],
    services: {
      pubsub: gossipsub({ emitSelf: false }),
      identify: identify(),
    },
  });

  node.handle("identity", createHandleIdentity(credential, acceptedPeers));
  node.addEventListener("peer:discovery", (evt) =>
    handlePeerDiscovery(credential, node, evt),
  );

  await node.start();
  console.log("Libp2p node started with id %s", node.peerId.toString());
  return node;
}

export { createAndStartNode };
