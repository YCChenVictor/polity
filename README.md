## Start project

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
