# Base stage
FROM --platform=linux/amd64 node:20-alpine AS base

# Install bash
RUN apk add --no-cache bash

# Add wait-for-it script and set permissions
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Set the working directory and change ownership
WORKDIR /app

# Configure Yarn to use a specific cache directory
# It will only re fetch the packages if the lock file changes
RUN yarn config set cache-folder /app/.yarn-cache

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application files and set permissions
COPY src src
# COPY tmp tmp
COPY tsconfig.json tsconfig.json
COPY ./start_dev.sh start_dev.sh
RUN chmod +x start_dev.sh

# Copy configuration files
COPY .env .env
COPY .sequelizerc .sequelizerc

ENTRYPOINT ["/wait-for-it.sh", "db-dev:5430", "--", "./start_dev.sh"]
