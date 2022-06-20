FROM node:alpine

EXPOSE 3000
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .

CMD ["npm", "start"]