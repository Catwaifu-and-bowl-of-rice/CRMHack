FROM node:14-alpine as build
WORKDIR /crm_front
ENV PATH /crm_front/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build