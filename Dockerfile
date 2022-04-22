FROM node:16

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .
COPY client/ ../client/

EXPOSE 3000
CMD [ "npm", "start" ]
