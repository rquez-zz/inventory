const Hapi = require('hapi');
const fs = require('fs');

const jwtHelper = require('./app/helpers/jwt');
const config = require('./config.js');
const database = require('./app/services/database');

const server = new Hapi.Server();

const key = fs.readFileSync(config.key);

server.connection(config.connection);

server.register([
{
    register: require('blipp'),
    options: { showAuth: true }
}, {
    register: require('hapi-router'),
    options: { routes: './app/routes/*.js' }
}, {
    register: require('hapi-auth-jwt')
}], (err) => {
    if (err) {
        console.log('Error registering hapi plugins');
        throw err;
    }
    server.auth.strategy('jwt', 'jwt', 'required', {
        validateFunc: jwtHelper.validateToken,
        key: key
    });
});

server.start(() => {
    console.log('Server running at: ' + server.info.uri);
});

module.exports = server;
