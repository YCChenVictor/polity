ARG NODE_VERSION
FROM --platform=linux/amd64 node:${NODE_VERSION}-alpine AS base
WORKDIR /app

RUN apk add --no-cache netcat-openbsd

# deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# sources + config
COPY hardhat.config.* tsconfig.* ./
COPY contracts ./contracts
COPY deploy ./deploy

# Copy configuration files
COPY .env .env

# start node + deploy (no compile at runtime)
CMD ["yarn", "start"]
