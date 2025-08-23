FROM node:20
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# app
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json

EXPOSE 3000
CMD ["yarn", "start"]
