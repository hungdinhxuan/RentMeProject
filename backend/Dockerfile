FROM node:16-alpine
RUN apk add dumb-init
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --production=true --network-timeout 1000000
COPY --chown=node:node . .
RUN node swagger.js
EXPOSE 4000
USER node
CMD ["dumb-init", "node", "main.js" ]
