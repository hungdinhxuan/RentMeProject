FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build


FROM nginx:1.20.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx/rentme_ssl /etc/ssl/rentme_ssl


