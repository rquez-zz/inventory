const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');
const jwtHelper = require('../helpers/jwt');

const User = require('../models/user');
const Category = require('../models/category');

const auth = {
    googleAuth: (req, reply) => {
        const authUrl = require('../../index').generate_google_oauth2_url();
        reply().redirect(authUrl);
    },
    authCallback: (req, reply, tokens, profile) => {
        const jwt = require('../helpers/jwt');
        const email = profile.emails[0].value;

        User.findOne({'email': email}).then(user => {

            if (user) {
                const token = {
                    email: email,
                    username: user.username,
                    id: user._id
                };
                return reply({ jwt: jwt.sign(token) });
            } else {

                // If user doesn't exist, return their email
                const token = {
                    email: email
                };
                return reply({ jwt: jwt.sign(token)});
            }
        }).catch(err => {
            return reply(Boom.badImplementation('Error authenticating user.', err));
        });
    },
    authCreate: (req, reply) => {

        if (!req.auth.credentials.email)
            return reply(Boom.unauthorized('Google user not authenticated.'));

        if (!req.auth.credentials.email === req.payload.email)
            return reply(Boom.badData('Email authenticated mismatch.'));

        User.findOne({'email': req.auth.credentials.email }).then(user => {

            if (user)
                return Promise.reject(Boom.conflict('Email for this user already exists.'));
            else
                return User.findOne({'username': req.payload.username });

        }).then(user => {

            if (user)
                return Promise.reject(Boom.conflict('Username for this user already exists.'));
            else {
                const newUser = new User({
                    email: req.payload.email,
                    username: req.payload.username,
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
    login: (req, reply) => {

        var query;
        if (req.payload.email)
            query = User.findOne({ 'email': req.payload.email }).exec();
        else
            query = User.findOne({ 'username': req.payload.username }).exec();

        query.then(user => {

            if (!user)
                return reply(Boom.notFound('User not found'));

            if (!user.password)
                return reply(Boom.conflict('No password for user. Must authenticate with Google.'));

            const token = {
                email: user.email,
                username: user.username,
                id: user._id
            };

            if (user.isValidPassword(req.payload.password))
                return reply({ jwt: jwtHelper.sign(token) });
            else
                return reply(Boom.unauthorized('Invalid password'));

        }).catch(err => {
            return reply(Boom.badImplementation('Error finding user', err));
        });
    }

};

module.exports = auth;
