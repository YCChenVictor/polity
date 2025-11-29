# Polity

This is a basic concept in my mind, which can possible improve current politics situation. The basic flow would be

```JS
await auth.login()

// Add rule and content for AI checkings
await ipfs.add(new File(["rule"], "rule.txt"))
await ipfs.add(new File(["content"], "content.txt"))
await ipfs.list()

await ai.check({type: "judge", ruleCid: "QmR5dzZnje3nFzHF1tMuaupJbyTGwEvMzDebvXuHLcLHn2", contentCid: "QmcE6b3XdECyDSCWfTGMnCxg17XBUDmbyNmF6MPwuLyWgg"})

await agora.create({})
await agora.vote()
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

## Mini

### Run test

Start ipfs

```
docker compose -f docker-compose.ipfs-test.yml up ipfs-test
```

```
yarn test
```

### Frontend

```bash
yarn start
```

### Backend

```bash
docker compose up --build
```

### Contracts

```
anvil
```

## 1) Prepare Base Law v0.1 (no repo file required)

```bash
CID=$(curl -sX POST "http://127.0.0.1:5001/api/v0/add" -F file=@constitution.md | jq -r .Hash)

# SHA-256 of EXACT bytes you pinned
export LAW_SHA256=0x$(printf '%b' "$LAW_TEXT" | openssl dgst -sha256 -binary | xxd -p -c256)

# CIDv1 string -> bytes hex (for constructor)
export LAW_CID_BYTES=$(node -e 'import{CID}from"multiformats/cid"; console.log("0x"+Buffer.from(CID.parse(process.argv[1]).bytes).toString("hex"))' "$CID")

export LAW_MIME="text/markdown"
```

## 2) Deploy

```bash
export PRIVATE_KEY=0xYOUR_KEY
forge script scripts/DeployPolity.s.sol:DeployPolity --rpc-url http://127.0.0.1:8545 --broadcast -vv
```
