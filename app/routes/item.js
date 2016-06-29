const itemHandler = require('../handlers/item');

const item = [
    {
        method: 'POST',
        path: '/item',
        handler: itemHandler.createItem
    },
    {
        method: 'PUT',
        path: '/item/{id}',
        handler: itemHandler.updateItem,
    },
    {
        method: 'GET',
        path: '/item/{id}',
        handler: itemHandler.getItem,
    },
    {
        method: 'DELETE',
        path: '/item/{id}',
        handler: itemHandler.deleteItem,
    }
];

module.exports = item;
