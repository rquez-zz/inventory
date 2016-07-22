const categoryHandler = require('../handlers/category');
const validator = require('../helpers/validator');

const category = [
    {
        method: 'POST',
        path: '/category',
        handler: categoryHandler.createCategory,
        config: {
            validate: {
                payload: validator.createCategory
            }
        }
    },
    {
        method: 'PUT',
        path: '/category/{id}',
        handler: categoryHandler.updateCategory,
        config: {
            validate: {
                payload: validator.updateCategory
            }
        }
    },
    {
        method: 'GET',
        path: '/category',
        handler: categoryHandler.getCategories
    },
    {
        method: 'GET',
        path: '/category/{id}',
        handler: categoryHandler.getItemsForCategory
    },
    {
        method: 'DELETE',
        path: '/category/{id}',
        handler: categoryHandler.deleteCategory
    }
];

module.exports = category;
