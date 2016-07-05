FROM node:latest
MAINTAINER Ricardo Vasquez "rvzxjr@gmail.com"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE 8080

CMD ["npm", "start"]
