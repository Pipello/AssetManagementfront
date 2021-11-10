FROM node:14.9

RUN mkdir app
 
COPY package*.json /app
COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]