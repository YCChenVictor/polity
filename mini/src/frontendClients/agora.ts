import { readContract, writeContract, getPublicClient } from "@wagmi/core";
import wagmiConfig from "../wagmiConfig";
import AgoraJson from "../../../contracts/out/Agora.sol/Agora.json";
import { base } from "./base";

const GOVERNOR_STATES = [
  "Pending", // 0
  "Active", // 1
  "Canceled", // 2
  "Defeated", // 3
  "Succeeded", // 4
  "Queued", // 5
  "Expired", // 6
  "Executed", // 7
] as const;

type GovernorState = (typeof GOVERNOR_STATES)[number];

const getClient = () => {
  const client = getPublicClient(wagmiConfig);
  if (!client) throw new Error("Public client not found (check wagmiConfig)");
  return client;
};

const create = async ({ cid }: { cid: string }) => {
  const accountInfo = await base.ensureAccount();

  const hash = await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "proposeIPFSEvent",
    args: [cid],
    account: accountInfo.address,
  });

  return hash;
};

const list = async () => {
  const tx = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: "proposals",
    args: [0n, 10n],
  });

  return tx;
};

const getProposalThreshold = async (): Promise<bigint> => {
  const threshold = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "proposalThreshold",
  });

  return threshold as bigint;
};

const fetchProposalState = async (id: bigint) => {
  return readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "state",
    args: [id],
  });
};

const vote = async (id: bigint, support: 0 | 1 | 2) => {
  const accountInfo = await base.ensureAccount();

  await writeContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "castVote",
    args: [id, support],
    account: accountInfo.address,
  });
};

const debugCast = async (id: bigint, support: 0 | 1 | 2) => {
  const pc = getPublicClient(wagmiConfig);
  if (!pc) {
    throw new Error("Public client not available");
  }

  const { address } = getAccount(wagmiConfig);
  if (!address) {
    throw new Error("Wallet not connected");
  }

  await pc.simulateContract({
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "castVote",
    args: [id, support],
    account: address,
  });
};

const listProposalsWithVotes = async (offset = 0n, limit = 10n) => {
  const proposals = await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: "proposals",
    args: [offset, limit],
  });

  return Promise.all(
    proposals.map(async (proposal) => {
      const [against, forVotes, abstain] = (await readContract(wagmiConfig, {
        address: import.meta.env.VITE_AGORA_ADDRESS,
        abi: AgoraJson.abi,
        functionName: "proposalVotes",
        args: [proposal.id],
      })) as readonly [bigint, bigint, bigint];

      return {
        ...proposal,
        votes: {
          against,
          for: forVotes,
          abstain,
        },
      };
    }),
  );
};

const getProposalState = async (
  proposalId: bigint,
): Promise<{ raw: bigint; label: GovernorState }> => {
  const raw = (await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS as `0x${string}`,
    abi: AgoraJson.abi,
    functionName: "state",
    args: [proposalId],
  })) as bigint;

  const index = Number(raw);
  const label = GOVERNOR_STATES[index] ?? "Pending";

  return { raw, label };
};

const getProposalVotes = async (proposalId: bigint) => {
  const [against, forVotes, abstain] = (await readContract(wagmiConfig, {
    address: import.meta.env.VITE_AGORA_ADDRESS,
    abi: AgoraJson.abi,
    functionName: "proposalVotes",
    args: [proposalId],
  })) as readonly [bigint, bigint, bigint];

  return {
    against,
    forVotes,
    abstain,
  };
};

export const agora = {
  debugCast,
  getProposalVotes,
  fetchProposalState,
  vote,
  getProposalThreshold,
  getClient,
  create,
  list,
  listProposalsWithVotes,
  getProposalState,
};
