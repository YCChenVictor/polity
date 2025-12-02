# Polity

This is a basic concept in my mind, which can possible improve current politics situation. The basic flow would be

## Start local development

```bash
cd mini

yarn vercel:dev # new tab
yarn chain:dev # new tab
yarn ipfs:dev # new tab
```

## Usual flow

In browser console,

```JS
// 0) Auth + voting power setup
await auth.login();

// helper
// await base.getCurrentBlock()
// await base.mineBlocks()

const myAddress = (await window.ethereum.request({
  method: "eth_requestAccounts",
}))[0];

// (optional) make sure I actually have voting power
await reward.delegateSelf(); // delegate votes to self
// await reward.getMyVotes(myAddress, 13n);
// await reward.fetchProposalVotingPower(
//   72380676904461645790063851811608348709253202756502912104745171844450372884334n,
//   myAddress,
// );

// 1) Upload rule + content to IPFS
const ruleFile = new File(["rule text..."], "rule.txt");
const contentFile = new File(["law article text..."], "article-1.txt");

const { cid: ruleCid } = await ipfs.add(ruleFile);
const { cid: contentCid } = await ipfs.add(contentFile);

console.log("ruleCid", ruleCid);
console.log("contentCid", contentCid);

// (optional) see what's on IPFS for debugging
await ipfs.list();

// 2) AI judge check *before* creating proposal
const judgeResult = await ai.check({
  type: "judge",
  ruleCid,
  contentCid,
});

if (!judgeResult.ok) {
  throw new Error("AI rejected proposal: " + judgeResult.reason);
}

// 3) Create proposal in Agora (returns proposalId)
const { proposalId } = await agora.create({
  ruleCid,
  contentCid,
  // other metadata: title, tags, category, etc.
});
console.log("proposalId", proposalId);

// (optional) fetch proposals for UI
await agora.list();

// 4) Start / participate in voting
// support: 0 = Against, 1 = For, 2 = Abstain (Governor-style)
// Sometimes the nonce in user browser is too high, remember to remove the history
await agora.vote( proposalId, support );

await agora.listProposalsWithVotes()

// 5) After voting period ends → if Succeeded, execute
await agora.getProposalState(proposalId);

// Mine the blocks

// 6) After execution, read on-chain result from Citizen
const events = await citizen.getAllApprovedEvents();
```

## Contribution

1.	Create an issue
	•	Write problem/feature, add labels, assignee, milestone if needed.
2.	Create a branch from main
	•	Name it like: feature/123-report-filters or bugfix/123-login-error.
3.	Code on that branch
	•	Commit with messages like: Fix #123: add date filter to reports.
4.	Open a Pull Request
	•	Base: main ← head: your branch.
	•	In description: Fixes #123 (or Closes #123).
5.	Review + CI
	•	Teammate (or you) reviews, checks tests, requests changes if needed.
6.	Merge the PR
	•	Use “Squash and merge” or “Merge commit”, depending on your style.
	•	Issue #123 auto-closes.
7.	Post-merge
	•	Delete branch, maybe tag release / update changelog.

loop: Issue → Branch → PR → Merge → Issue closed.
