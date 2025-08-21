FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 8545

CMD ["yarn", "start"]
