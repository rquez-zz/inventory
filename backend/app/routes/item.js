const itemHandler = require('../handlers/item');
const validator = require('../helpers/validator');

const item = [
    {
        method: 'POST',
        path: '/item',
        handler: itemHandler.createItem,
        config: {
            validate: {
                payload: validator.createItem
            }
        }
    },
    {
        method: 'PUT',
        path: '/item/{id}',
        handler: itemHandler.updateItem,
        config: {
            validate: {
                payload: validator.createItem
            }
        }
    },
    {
        method: 'GET',
        path: '/item/{id}',
        handler: itemHandler.getItem
    },
    {
        method: 'DELETE',
        path: '/item/{id}',
        handler: itemHandler.deleteItem
    }
];

module.exports = item;
