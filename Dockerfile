FROM node:lts as build
ARG TARGET_ENVIRONMENT="production"
WORKDIR /usr/src/app
RUN sh -c '[ -z "$http_proxy" ] || ( npm config set proxy $http_proxy; npm config set https-proxy $http_proxy )'
COPY package.json package-lock.json webpack.config.cjs tsconfig.json ./
RUN npm install
COPY ./public ./public
COPY ./src ./src

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
