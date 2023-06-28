FROM node:alpine

WORKDIR /server

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]