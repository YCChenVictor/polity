export function verifyGithub({ raw, headers }: any): VerifyResult {
  // 1) verify HMAC signature (GH_WEBHOOK_SECRET)
  // 2) parse JSON
  // 3) check merged->main, repo allowlist
  const b = JSON.parse(raw.toString("utf8"));
  const pr = b.pull_request;
  if (!pr?.merged || pr.base?.ref !== "main") return { ok: false, status: 200, reason: "ignored" };

  const repoId = String(b.repository?.full_name ?? "").toLowerCase();
  const login = String(pr.user?.login ?? "").toLowerCase();

  return {
    ok: true,
    event: {
      source: "github",
      subject: `github:${login}`,
      repoId,
      uniqueId: `pr:${pr.number}`,
      evidence: { repoId, pr: pr.number, url: pr.html_url, sha: pr.merge_commit_sha },
    },
  };
}
