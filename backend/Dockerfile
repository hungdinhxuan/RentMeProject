FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install --production=true
COPY . .
EXPOSE 4000
CMD [ "yarn", "start" ]