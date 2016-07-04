const userHandler = require('../handlers/user');
const authHandler = require('../handlers/auth');

const user = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser,
        config: { auth: false }
    },
    {
        method: 'POST',
        path: '/user/auth',
        handler: authHandler.authCreate
    },
    {
        method: 'POST',
        path: '/user/password',
        handler: userHandler.updatePassword
    },
    {
        method: 'PUT',
        path: '/user',
        handler: userHandler.updateUser
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
