FROM node:12.13-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
RUN rm -rf /usr/src/app/node_modules
RUN npm install --only=development
COPY . .
RUN npm i -g rimraf
RUN npm i ansi-styles @sentry/node @sentry/tracing
RUN npm run build

FROM node:12.13-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
RUN rm -rf /usr/src/app/node_modules
RUN npm install --only=production
RUN npm i newrelic
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["npm", "run", "start:prod"]