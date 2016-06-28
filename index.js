const Hapi = require('hapi');
const fs = require('fs');

const config = require('./config.js');
const database = require('./app/services/database');

const server = new Hapi.Server();

server.connection(config.connection);

server.register([
{
    register: require('blipp'),
    options: { showAuth: true }
},
{
    register: require('hapi-router'),
    options: { routes: './app/routes/*.js' }
}], (err) => {
    if (err) {
        console.log('Error registering hapi plugins');
        throw err;
    }
});

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});

module.exports = server;
