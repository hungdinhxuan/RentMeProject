FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build


FROM nginx:1.20.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80 443

