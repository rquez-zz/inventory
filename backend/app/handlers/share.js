const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');

const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const Category = require('../models/category');

const share = {
    createShare: (req, reply) => {

        const myId = new ObjectId(req.auth.credentials.id);
        const friendUsername = req.payload.friendUsername;
        const myUsername = req.auth.credentials.username;

        // Find my user
        User.findOne({'_id': myId }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            if (!user.categories.id(req.params.cid))
                return Promise.reject(Boom.notFound('Category not found.'));

            if (user.categories.id(req.params.cid).sharedTo.includes(req.payload.shareToUser))
                return Promise.reject(Boom.conflict('Already sharing to user.'));

            // Save friend user in my user
            user.categories.id(req.params.cid).sharedTo.push(friendUsername);
            return user.save();
        }).then(() => {

            // Find target user
            return User.findOne({'username': friendUsername });
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            const newCategory = new Category({
                name: req.payload.categoryName,
                sharedFrom: myUsername,
                _id: new ObjectId(req.params.cid)
            });

            // Save new category for target user
            user.categories.push(newCategory);

            return user.save();
        }).then(() => {
            return reply().code(201);
        }).catch(err => {
            return reply(err);
        });
    },
    getShare: (req, reply) => {

        // Find user that shared to me
        User.findOne({
            'username': req.params.friendUsername,
            'categories._id': new ObjectId(req.params.cid)
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User or category not found.'));

            if (user.categories.id(req.params.cid).sharedTo.includes(req.auth.credentials.username))
                return User.aggregate(
                {
                    $match: { 'inventory.categoryId': req.params.cid }
                }, {
                    $unwind: '$inventory'
                }, {
                    $match: { 'inventory.categoryId': req.params.cid }
                }, {
                    $project: {
                        name:'$inventory.name',
                        quantity: '$inventory.quantity',
                        categoryName: '$inventory.categoryName',
                        categoryId: '$inventory.categoryId',
                        comments: '$inventory.comments',
                        dateAdded: '$inventory.dateAdded'
                    }
                });
            else
                return Promise.reject(Boom.unauthorized('Unauthorized access to user inventory.'));

        }).then(result => {
            return reply(result);
        }).catch(err => {
            return reply(err);
        });
    },
    deleteShare: (req, reply) => {

        const myId = new ObjectId(req.auth.credentials.id);
        const myUsername = req.auth.credentials.username;
        const friendId = req.params.friendUsername;

        // Find my user
        User.findOne({
            '_id': myId,
            'categories._id': new ObjectId(req.params.cid)
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            if (!user.categories.id(req.params.cid))
                return Promise.reject(Boom.notFound('Category not found.'));

            // Remove friend user in my user
            user.categories.id(req.params.cid).sharedTo.pull(friendUsername);
            return user.save();
        }).then(() => {

            // Find friend user
            return User.findOne({
                '_id': friendId,
                'categories._id': new ObjectId(req.params.cid)
            });
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            // Remove my id in friend user
            delete user.categories.id(req.params.cid).sharedFrom;
            return user.save();
        }).then(() => {
            return reply().code(204);
        }).catch(err => {
            return reply(err);
        });
    }
};

module.exports = share;
