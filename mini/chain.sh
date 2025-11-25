set -euo pipefail

RPC_PORT="${1:-8546}"
TARGET_ENV="${2:-local}"
QA_USER="${3:-}"
RPC_URL="http://127.0.0.1:${RPC_PORT}"
CONTRACTS_DIR="../smart-contracts"
FRONTEND_FILE="src/contracts.${TARGET_ENV}.ts"

echo "RPC_URL       = ${RPC_URL}"
echo "TARGET_ENV    = ${TARGET_ENV}"
echo "FRONTEND_FILE = ${FRONTEND_FILE}"

anvil --port "${RPC_PORT}" &
ANVIL_PID=$!
echo "Started anvil (pid=${ANVIL_PID}) on ${RPC_URL}"

cleanup() {
  echo "Stopping anvil..."
  kill "${ANVIL_PID}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for anvil..."
until curl -s -X POST "${RPC_URL}" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' >/dev/null 2>&1; do
  sleep 0.5
done
echo "Anvil is ready."

cd "${CONTRACTS_DIR}"

QA_USER="${QA_USER}" \
forge script scripts/DeployPolity.s.sol:DeployPolity \
  --rpc-url "${RPC_URL}" \
  --broadcast -vv

BROADCAST_PATH="broadcast/DeployPolity.s.sol/31337/run-latest.json"

VOTE_ADDR=$(jq -r '.transactions[] | select(.contractName=="Vote").contractAddress' "$BROADCAST_PATH" | head -n 1)
CITIZEN_ADDR=$(jq -r '.transactions[] | select(.contractName=="Citizen").contractAddress' "$BROADCAST_PATH" | head -n 1)
TIMELOCK_ADDR=$(jq -r '.transactions[] | select(.contractName=="TimelockController").contractAddress' "$BROADCAST_PATH" | head -n 1)
REWARD_ADDR=$(jq -r '.transactions[] | select(.contractName=="Reward").contractAddress' "$BROADCAST_PATH" | head -n 1)
AGORA_ADDR=$(jq -r '.transactions[] | select(.contractName=="Agora").contractAddress' "$BROADCAST_PATH" | head -n 1)

cd - >/dev/null

mkdir -p "$(dirname "${FRONTEND_FILE}")"

if [ "$TARGET_ENV" = "test" ]; then
  ENV_FILE=".env.test"
else
  ENV_FILE=".env"
fi

cat > "$ENV_FILE" <<EOF
VITE_AGORA_ADDRESS=${AGORA_ADDR}
VITE_CITIZEN_ADDRESS=${CITIZEN_ADDR}
VITE_VOTE_ADDRESS=${VOTE_ADDR}
VITE_TIMELOCK_ADDRESS=${TIMELOCK_ADDR}
VITE_REWARD_ADDRESS=${REWARD_ADDR}
EOF

echo "Wrote ${FRONTEND_FILE}"
echo "Deploy done. Anvil is still running on ${RPC_URL}. Press Ctrl+C to stop."
wait "${ANVIL_PID}"
