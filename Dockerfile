FROM node:10.15.3

# Create app directory
RUN mkdir -p /usr/app

WORKDIR /usr/app

# Install app dependencies
COPY package.json /usr/app
RUN npm install

# Bundle app source
COPY . /usr/app

EXPOSE 8000
CMD [ "npm", "start" ]