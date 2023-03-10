FROM node:19-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT 8080

CMD ["npm", "run", "start"]