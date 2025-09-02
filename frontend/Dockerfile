FROM node:20
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# app
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
COPY ./start_dev.sh start_dev.sh
RUN chmod +x start_dev.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./start_dev.sh"]
