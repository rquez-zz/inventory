const authHandler = require('./../handlers/auth');

const auth = [
    {
        method: 'POST',
        path: '/login',
        handler: authHandler.login,
        config: { auth: false, }
    }
];

module.exports = auth;
