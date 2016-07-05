const categoryHandler = require('../handlers/category');

const category = [
    {
        method: 'POST',
        path: '/category',
        handler: categoryHandler.createCategory
    },
    {
        method: 'PUT',
        path: '/category/{id}',
        handler: categoryHandler.updateCategory
    },
    {
        method: 'GET',
        path: '/category/{id}',
        handler: categoryHandler.getCategory
    },
    {
        method: 'DELETE',
        path: '/category/{id}',
        handler: categoryHandler.deleteCategory
    }
];

module.exports = category;
