FROM node:16-alpine
RUN apk add dumb-init
WORKDIR /app
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --production=true
COPY --chown=node:node . .
EXPOSE 4000
USER node
CMD ["dumb-init", "node", "main.js" ]
