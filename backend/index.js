const Hapi = require('hapi');
const fs = require('fs');

const config = require('./config');
const jwtHelper = require('./app/helpers/jwt');
const database = require('./app/services/database');

const server = new Hapi.Server();

const key = fs.readFileSync(config.key);
const apiKeyJson = JSON.parse(fs.readFileSync(config.google.key));

process.env.GOOGLE_CLIENT_ID = apiKeyJson.web.client_id;
process.env.GOOGLE_CLIENT_SECRET = apiKeyJson.web.client_secret;
process.env.BASE_URL = apiKeyJson.web.javascript_origins[0];
process.env.PORT = '3000';

server.connection(config.connection);

server.register([
{
    register: require('hapi-auth-google'),
    options: config.google.opts
},
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
