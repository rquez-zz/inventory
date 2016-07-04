const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');

const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const Category = require('../models/category');

const share = {
    createShare: (req, reply) => {

        const myId = new ObjectId(req.auth.credentials.id);
        const friendId = new ObjectId(req.payload.shareToUser);

        // Find my user
        User.findOne({'_id': myId }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            if (!user.categories.id(req.params.cid))
                return Promise.reject(Boom.notFound('Category not found.'));

            if (user.categories.id(req.params.cid).sharedTo.includes(req.payload.shareToUser))
                return Promise.reject(Boom.conflict('Already sharing to user.'));

            // Save friend user in my user
            user.categories.id(req.params.cid).sharedTo.push(friendId);
            return user.save();
        }).then(() => {

            // Find target user
            return User.findOne({'_id': friendId })
        }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found.'));

            const newCategory = new Category({
                name: req.payload.categoryName,
                color: req.payload.categoryColor,
                sharedFrom: [myId],
                _id: new ObjectId(req.params.cid)
            });

            // Save new category for target user
            user.categories.push(newCategory);

            return user.save();
        }).then(() => {
            return reply().code(201);
        }).catch(err => {
            return reply(Boom.badImplementation('Error adding shared user.', err));
        });
    },
    getShare: (req, reply) => {

        // Find user that shared to me
        User.findOne({
            '_id': new ObjectId(req.params.tid),
            'categories._id': new ObjectId(req.params.cid)
        }).then(user => {

            if (!user)
                return reply(Boom.notFound('User or category not found.'));

            if (user.categories.id(req.params.cid).sharedTo.includes(req.auth.credentials.id))
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
                        categoryId: '$inventory.categoryId',
                        categoryName: '$inventory.categoryName'
                    }
                });
            else
                return reply(Boom.unauthorized('Unauthorized access to user inventory.'));

        }).then(result => {
            return reply(result);
        }).catch(err => {
            return reply(Boom.badImplementation('Error adding shared user.', err));
        });
    },
    deleteShare: (req, reply) => {

        const myId = new ObjectId(req.auth.credentials.id);
        const friendId = new ObjectId(req.params.tid);

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
            user.categories.id(req.params.cid).sharedTo.pull(friendId);
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
            user.categories.id(req.params.cid).sharedFrom.pull(myId);
            return user.save();
        }).then(() => {
            return reply().code(204);
        }).catch(err => {
            return reply(Boom.badImplementation('Error adding shared user.', err));
        });
    }
};

module.exports = share;
