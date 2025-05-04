import { createLibp2p, Libp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { gossipsub, GossipsubEvents } from "@chainsafe/libp2p-gossipsub";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { Identify, identify } from "@libp2p/identify";
import { mdns } from "@libp2p/mdns";
import { PubSub, PeerId, Stream } from "@libp2p/interface";

async function makeNode(topic: string, port: number) {
  const node = await createLibp2p({
    transports: [tcp()],
    connectionEncrypters: [noise()],
    streamMuxers: [mplex()],
    addresses: { listen: [`/ip4/127.0.0.1/tcp/${port}`] },
    peerDiscovery: [
      mdns(),
      pubsubPeerDiscovery({
        topics: [topic],
      }),
    ],
    services: {
      pubsub: gossipsub({
        emitSelf: false,
      }),
      identify: identify(),
    },
  });

  await node.start();

  return node;
}

async function verifyIdentityCredential(
  acceptedPeers: Set<string>,
  stream: Stream,
  peerId: PeerId,
): Promise<boolean> {
  const decoder = new TextDecoder();
  let credential = "";

  for await (const chunk of stream.source) {
    credential += decoder.decode(chunk.subarray(), { stream: true });
  }

  if (credential === process.env.CREDENTIAL) {
    acceptedPeers.add(peerId.toString());
    await stream.close();
    return false;
  }

  return true;
}

async function sendIdentityCredential(
  node: Libp2p<{ pubsub: PubSub<GossipsubEvents>; identify: Identify }>,
  peerId: PeerId,
) {
  const stream = await node.dialProtocol(peerId, "/identity/1.0.0");
  const encoder = new TextEncoder();
  const writer = stream.sink;
  await writer([encoder.encode(process.env.CREDENTIAL)]);
  stream.close();
}

export { makeNode, verifyIdentityCredential, sendIdentityCredential };
