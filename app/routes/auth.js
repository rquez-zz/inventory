const authHandler = require('./../handlers/auth');

const auth = [
    {
        method: 'POST',
        path: '/login',
        handler: authHandler.login,
        config: { auth: false }
    },
    {
        method: 'GET',
        path: '/login',
        handler: authHandler.googleAuth,
        config: { auth: false }
    }
];

module.exports = auth;
