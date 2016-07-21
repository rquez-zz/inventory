const userHandler = require('../handlers/user');
const authHandler = require('../handlers/auth');
const validator = require('../helpers/validator');

const user = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser,
        config: {
            auth: false,
            validate: {
                payload: validator.createUser
            }
        }
    },
    {
        method: 'POST',
        path: '/user/auth',
        handler: authHandler.googleAuthCreate,
        config: {
            validate: {
                payload: validator.createUserGoogle
            }
        }
    },
    {
        method: 'POST',
        path: '/user/password-confirm',
        handler: authHandler.updatePassword,
        config: {
            validate: {
                payload: validator.updatePassword
            }
        }
    },
    {
        method: 'POST',
        path: '/user/password',
        handler: userHandler.updatePassword,
        config: {
            validate: {
                payload: validator.updatePassword
            }
        }
    },
    {
        method: 'PUT',
        path: '/user',
        handler: userHandler.updateUser,
        config: {
            validate: {
                payload: validator.updateUser
            }
        }
    },
    {
        method: 'GET',
        path: '/user',
        handler: userHandler.getUser
    },
    {
        method: 'DELETE',
        path: '/user',
        handler: userHandler.deleteUser
    }
];

module.exports = user;
