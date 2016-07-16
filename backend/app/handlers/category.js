const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');

const User = require('../models/user');
const Category = require('../models/category');

const category = {
    createCategory: (req, reply) => {

        var categoryId; // Storing the id of the new item

        User.findOne({ 'username':req.auth.credentials.username })
            .then(user => {

                if (!user)
                    return Promise.reject(Boom.notFound('User not found.'));

                const newCategory = new Category({
                    name: req.payload.name,
                    color: req.payload.color
                });

                // Push item to inventory and get _id
                user.categories.push(newCategory);
                categoryId = newCategory._id;

                return user.save();
            }).then(user => {
                return reply(user.categories.id(categoryId));
            }).catch(err => {
                return reply(err);
            });
    },
    updateCategory: (req, reply) => {

        User.findOne({
                'username': req.auth.credentials.username,
                'categories._id': req.params.id
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('Category not found.'));

            user.categories.id(req.params.id).name = req.payload.name;
            user.categories.id(req.params.id).color = req.payload.color;

            return user.save();
        }).then(user => {
            return reply(user.categories.id(req.params.id));
        }).catch(err => {
            return reply(err);
        });
    },
    getCategory: (req, reply) => {

        User.findOne({
                    'username': req.auth.credentials.username,
                    'categories._id': req.params.id
        }).then(user => {

            if (!user)
                return reply(Boom.notFound('Category not found'));

            return reply(user.categories.id(req.params.id));
        }).catch(err => {
            return reply(err);
        })
    },
    deleteCategory: (req, reply) => {

        User.findOne({
                    'username': req.auth.credentials.username,
                    'categories._id': req.params.id
        }).then(user => {

            if (!user)
                return reply(Boom.notFound('Category not found'));

            user.categories.id(req.params.id).remove();
            return user.save();
        }).then(user => {
            return reply().code(204);
        }).catch(err => {
            return reply(err);
        })
    }
};

module.exports = category;
