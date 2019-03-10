FROM node:10.15-alpine as base
WORKDIR /app
COPY ./package.json ./package-lock.json ./tsconfig.json ./
RUN npm ci
COPY . ./
RUN npm run build

CMD [ "npm start" ]
