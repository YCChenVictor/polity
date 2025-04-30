import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { pubsubPeerDiscovery } from "@libp2p/pubsub-peer-discovery";
import { identify } from "@libp2p/identify";
import { mdns } from "@libp2p/mdns";

async function makeNode(port: number) {
  const topic = `myproject/node-announcements`; // TODO: make this dynamic

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

export { makeNode };
