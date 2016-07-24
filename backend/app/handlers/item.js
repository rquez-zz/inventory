const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');

const User = require('../models/user');
const Item = require('../models/item');
const Reminder = require('../models/reminder');
const ObjectId = require('mongoose').Types.ObjectId;

const item = {
    createItem: (req, reply) => {

        var itemId; // Storing the id of the new item

        User.findOne({ 'username':req.auth.credentials.username })
            .then(user => {

                if (!user)
                    return Promise.reject(Boom.notFound('User not found.'));

                if (!user.categories.id(req.payload.categoryId))
                    return Promise.reject(Boom.notFound('Category not found.'));

                if (user.categories.id(req.payload.categoryId).name !== req.payload.categoryName)
                    return Promise.reject(Boom.notFound('Category not found.'));

                var newItem = new Item({
                    name: req.payload.name,
                    quantity: req.payload.quantity,
                    categoryName: req.payload.categoryName,
                    categoryId: req.payload.categoryId,
                    dateAdded: Date.now(),
                    comments: req.payload.comments,
                    reminder: new Reminder({
                        message: req.payload.reminder.message,
                        date: req.payload.reminder.date,
                        sent: false
                    })
                });

                // Push item to inventory and get _id
                user.inventory.push(newItem);
                itemId = newItem._id;

                return user.save();
            }).then(user => {
                return reply(user.inventory.id(itemId));
            }).catch(err => {
                return reply(err);
            });
    },
    updateItem: (req, reply) => {

        User.findOne({
            'username': req.auth.credentials.username
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            console.log(user.inventory);

            if (!user.categories.id(req.payload.categoryId))
                return Promise.reject(Boom.notFound('Category not found.'));

            if (!user.inventory.id(req.params.id))
                return Promise.reject(Boom.notFound('Item not found.'));

            user.inventory.id(req.params.id).name = req.payload.name;
            user.inventory.id(req.params.id).quantity = req.payload.quantity;
            user.inventory.id(req.params.id).categoryId = req.payload.categoryId;
            user.inventory.id(req.params.id).categoryName = req.payload.categoryName;
            user.inventory.id(req.params.id).comments = req.payload.comments;
            user.inventory.id(req.params.id).reminder = req.payload.reminder;

            return user.save();
        }).then(user => {
            return reply(user.inventory.id(req.params.id));
        }).catch(err => {
            return reply(err);
        });
    },
    getItem: (req, reply) => {

        User.findOne({
            'username': req.auth.credentials.username,
            'inventory._id': new ObjectId(req.params.id)
        }).then(user => {

            if (!user)
                return reply(Boom.notFound('Item not found'));

            return reply(user.inventory.id(req.params.id));
        }).catch(err => {
            return reply(err);
        });
    },
    deleteItem: (req, reply) => {

        User.findOne({
            'username': req.auth.credentials.username,
            'inventory._id': new ObjectId(req.params.id)
        }).then(user => {

            if (!user)
                return reply(Boom.notFound('Item not found'));

            user.inventory.id(req.params.id).remove();
            return user.save();
        }).then(user => {
            return reply().code(204);
        }).catch(err => {
            return reply(err);
        });
    }
};

module.exports = item;
