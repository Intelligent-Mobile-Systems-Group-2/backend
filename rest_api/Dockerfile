FROM node

WORKDIR /rest_api

COPY *.json ./
COPY ./src ./src/

RUN npm install

CMD npm run dev