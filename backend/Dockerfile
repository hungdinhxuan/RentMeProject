FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . /usr/src/app
RUN yarn run build
EXPOSE 4000
CMD [ "yarn", "run", "start:prod"]