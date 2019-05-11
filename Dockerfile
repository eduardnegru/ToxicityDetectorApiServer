FROM node:10.15.3
WORKDIR /app
COPY package.json ./app
RUN npm install
COPY . /app
CMD npm start