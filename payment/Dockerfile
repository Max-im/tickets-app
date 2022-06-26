FROM node:alpine

EXPOSE 3000
WORKDIR /app
COPY package.json .
RUN npm i --only=prod
COPY . .

CMD ["npm", "start"]