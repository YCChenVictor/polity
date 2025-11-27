import { describe, it, expect, vi } from "vitest";
import * as wagmiCore from "@wagmi/core";

import { agora } from "../../src/frontendClients/agora";

vi.mock("@wagmi/core", async (importActual) => {
  const actual = await importActual<typeof import("@wagmi/core")>();
  return {
    ...actual,
    readContract: vi.fn().mockResolvedValue([
      { id: 1n, kind: 0, proposer: "0xabc" as `0x${string}` },
    ]),
    writeContract: vi.fn().mockResolvedValue(
      "0xFAKE_TX_HASH0000000000000000000000000000000000000000000000000000",
    ),
  };
});

describe("agora.create", () => {
  it("calls writeContract with correct args and returns tx hash", async () => {
    const cid = "QmNhxMLMvraxE6Jk4JnYPFaErAbvZcDNVomfCN1zovWXXt";

    const hash = await agora.create({ cid });

    expect(hash).toBe(
      "0xFAKE_TX_HASH0000000000000000000000000000000000000000000000000000",
    );

    expect(wagmiCore.writeContract).toHaveBeenCalledTimes(1);
    expect(wagmiCore.writeContract).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        functionName: "proposeIPFSEvent",
        args: [cid],
      }),
    );
  });
});
