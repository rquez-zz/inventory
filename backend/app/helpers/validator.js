const Joi = require('joi');

module.exports = {

    login: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email()
    }).with('username', 'password').with('email', 'password').without('email', 'username'),

    resetPassword: Joi.object({
        email: Joi.string().email().required()
    }),

    updatePassword: Joi.object({
        password: Joi.string().alphanum().min(3).max(30).required()
    }),

    createCategory: Joi.object({
        name: Joi.string().alphanum().required()
    }),

    updateCategory: Joi.object({
        name: Joi.string().required()
    }),

    createItem: Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().min(1).max(10000).required(),
        categoryId: Joi.string().required(),
        categoryName: Joi.string().required(),
        comments: Joi.string(),
        reminder: Joi.object({
            message: Joi.string(),
            date: Joi.date(),
        })
    }),

    createShare: Joi.object({
        friendUsername: Joi.string().required(),
        categoryName: Joi.string().alphanum().required()
    }),

    createUser: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required()
    }),

    createUserGoogle: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required()
    }),

    updateUser: Joi.object({
        email: Joi.string().email().required(),
        notificationsOn: Joi.boolean().required()
    })
};
