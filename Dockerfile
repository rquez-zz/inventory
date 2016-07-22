FROM node:latest
MAINTAINER Ricardo Vasquez "rvzxjr@gmail.com"

RUN mkdir -p /usr/src/app/backend
RUN mkdir -p /usr/src/app/frontend

COPY frontend /usr/src/app/frontend
COPY backend /usr/src/app/backend

WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm install -g gulp
RUN gulp build

WORKDIR /usr/src/app/backend
RUN npm install

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
