import type { VercelRequest, VercelResponse } from "@vercel/node";

import { walletClient } from "../lib/viemClients"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const hash = await walletClient.writeContract({
      address: MERIT,
      abi: MERIT_ABI,
      functionName: "recordContribution",
      args: [subjectId, citizen, nonce],
    });

    await publicClient.waitForTransactionReceipt({ hash });

    return res.status(200).json({ ok: true, tx: hash });
  } catch (error) {
    console.log(error)
  }
}
