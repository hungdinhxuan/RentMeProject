FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "./"]

RUN yarn install --production

COPY . .

EXPOSE 4000

CMD [ "node", "main.js" ]
