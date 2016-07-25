const authHandler = require('./../handlers/auth');
const validator = require('../helpers/validator');

const auth = [
    {
        method: 'POST',
        path: '/login',
        handler: authHandler.login,
        config: {
            auth: false,
            validate: {
                payload: validator.login
            }
        }
    },
    {
        method: 'POST',
        path: '/auth',
        handler: authHandler.googleAuth,
        config: { auth: false }
    },
    {
        method: 'POST',
        path: '/reset-password',
        handler: authHandler.resetPassword,
        config: {
            auth: false,
            validate: {
                payload: validator.resetPassword
            }
        }
    },
    {
        method: 'GET',
        path: '/reset-password-confirm/{token}',
        handler: authHandler.resetPasswordAuth,
        config: { auth: false }
    },
];

module.exports = auth;
