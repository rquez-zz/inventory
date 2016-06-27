const Hapi = require('hapi');
const fs = require('fs');

const config = require('./config.js');

const server = new Hapi.Server();

server.connection(config.connection);

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});

module.exports = server;
