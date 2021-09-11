FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=true
COPY . .
EXPOSE 4000
CMD [ "yarn", "start" ]
