const userHandler = require('../handlers/user');

const user = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser
    },
    {
        method: 'PUT',
        path: '/user',
        handler: userHandler.updateUser,
    },
    {
        method: 'GET',
        path: '/user',
        handler: userHandler.getUser,
    },
    {
        method: 'DELETE',
        path: '/user',
        handler: userHandler.deleteUser,
    }
];

module.exports = user;
