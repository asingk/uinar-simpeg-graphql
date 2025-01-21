ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine AS builder
LABEL authors="asingk"

RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app
COPY --chown=node:node yarn.lock package.json ./
USER node
RUN yarn install
COPY --chown=node:node . .
RUN npx prisma generate
RUN yarn compile

FROM node:${NODE_VERSION}-alpine
LABEL authors="asingk"

RUN apk update && \
	apk add --no-cache tzdata

ENV TZ=Asia/Jakarta

RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

# Create app directory
WORKDIR /home/node/app
COPY --chown=node:node yarn.lock package.json ./
USER node
RUN yarn install --prod
COPY prisma/schema.prisma ./
RUN npx prisma generate

COPY --from=builder /home/node/app/dist ./dist

COPY schema.graphql ./

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
