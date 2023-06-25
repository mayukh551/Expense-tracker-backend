FROM node

WORKDIR /server

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]

EXPOSE 5000