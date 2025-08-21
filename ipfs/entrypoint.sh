#!/bin/sh
set -e
ipfs init --profile=server || true
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000","http://127.0.0.1:3000","*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET","POST","PUT","OPTIONS"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization","Content-Type"]'
exec ipfs daemon --migrate=true