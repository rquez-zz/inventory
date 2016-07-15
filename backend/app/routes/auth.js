const authHandler = require('./../handlers/auth');

const auth = [
    {
        method: 'POST',
        path: '/login',
        handler: authHandler.login,
        config: { auth: false }
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
        config: { auth: false }
    },
    {
        method: 'GET',
        path: '/reset-password-confirm/{token}',
        handler: authHandler.resetPasswordAuth,
        config: { auth: false }
    },
    {
        method: 'POST',
        path: '/reset-password-confirm',
        handler: authHandler.resetPasswordConfirm
    }
];

module.exports = auth;
