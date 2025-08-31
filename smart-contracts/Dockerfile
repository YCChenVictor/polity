FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache netcat-openbsd

# deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# sources + config
COPY hardhat.config.* tsconfig.* ./
COPY contracts ./contracts
COPY deploy ./deploy

# ✅ download compiler & compile during image build
RUN npx hardhat compile

# start node + deploy (no compile at runtime)
CMD ["yarn", "start"]
