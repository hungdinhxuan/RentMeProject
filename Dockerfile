FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --network-timeout 1000000
COPY . .
RUN yarn build


FROM nginx:1.20.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# SSL certificates for production (ensure these exist or mount secrets in runtime)
COPY --from=builder /usr/src/app/nginx/rentme_ssl /etc/ssl
# Use production nginx configuration
COPY --from=builder /usr/src/app/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443

