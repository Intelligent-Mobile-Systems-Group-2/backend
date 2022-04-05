FROM node

WORKDIR /rest_api

COPY *.json ./
COPY ./src ./src/

RUN npm ci

CMD npm run dev