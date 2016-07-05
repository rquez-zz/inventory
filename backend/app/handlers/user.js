const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');

const jwtHelper = require('../helpers/jwt');

const User = require('../models/user');
const Category = require('../models/category');

const user = {
    createUser: (req, reply) => {
        User.findOne({'email': req.payload.email }).then(user => {

            if (user)
                return reply(Boom.conflict('Email for this user already exists.'));
            else
                return User.findOne({'username': req.payload.username });

        }).then(user => {

            if (user)
                return reply(Boom.conflict('Username for this user already exists.'));
            else {
                const newUser = new User({
                    email: req.payload.email,
                    username: req.payload.username,
                    password: User.hashPassword(req.payload.password),
                    categories: [new Category({name: 'main', color: 'blue'})]
                });
                return newUser.save();
            }

        }).then(user => {

            user.password = undefined; // exclude the hashed password
            return reply(user).header('location', '/user/' + user.username);
        }).catch(err => {
            return reply(Boom.badImplementation('Error saving user to db.', err));
        });
    },
    updateUser: (req, reply) => {

        var put = req.payload;
        put.password = undefined;

        User.findOneAndUpdate({ 'username': req.auth.credentials.username }, put, { 'new': true })
            .then(user => {
                if (!user)
                    return reply(Boom.notFound('User not found'));

                user.password = undefined; // exclude the hashed password
                return reply(user);
            }).catch(err => {
                return reply(Boom.badImplementation('Error updating user.', err));
            });
    },
    updatePassword: (req, reply) => {

        User.findOne({
                'username': req.auth.credentials.username,
            }).then(user => {

                if (!user)
                    return Promise.reject(Boom.notFound('User not found.'));

                if (req.auth.credentials.passwordUpdate)
                    user.password = User.hashPassword(req.payload.password);
                else
                    return Promise.reject(Boom.unauthorized('Password changed not confirmed.'));

                return user.save();
            }).then(user => {

                const token = {
                    email: user.email,
                    username: user.username,
                    id: user._id
                };
                return reply({ jwt: jwtHelper.sign(token) });
            }).catch(err => {
                return reply(Boom.badImplementation('Error updating item.', err));
            });
    },
    getUser: (req, reply) => {

        User.findOne({ 'username': req.auth.credentials.username })
            .then(user => {

                if (!user)
                    return reply(Boom.notFound('User not found'));

                user.password = undefined; // exclude the hashed password
                return reply(user);
            }).catch(err => {
                return reply(Boom.badImplementation('Error getting user from db.', err));
            });
    },
    deleteUser: (req, reply) => {

        User.findOneAndRemove({ username: req.auth.credentials.username })
            .then(user => {

                if (!user)
                    return reply(Boom.notFound('User not found'));

                return reply().code(204);
            }).catch(err => {
                return reply(Boom.badImplementation('Error deleting user from db.', err));
            });
    }
};

module.exports = user;
