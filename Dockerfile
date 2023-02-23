FROM node:19-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ARG PORT=3333
ENV PORT=$PORT
EXPOSE $PORT

CMD ["npm", "run", "start"]