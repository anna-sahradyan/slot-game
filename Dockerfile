
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .


RUN npm run build

FROM php:8.1-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist /var/www/html

COPY ./server /var/www/html/server


EXPOSE 8081

CMD ["php", "-S", "localhost:8081", "-t", "."]
