FROM --platform=linux/amd64 node:22-alpine AS base
WORKDIR /app

RUN yarn config set cache-folder /app/.yarn-cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files and set permissions
COPY src src
# COPY tmp tmp
COPY tsconfig.json tsconfig.json
COPY ./start_dev.sh start_dev.sh
RUN chmod +x start_dev.sh

CMD ["yarn", "start"]
