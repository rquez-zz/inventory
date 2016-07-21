const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Boom = require('boom');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const jwtHelper = require('../helpers/jwt');

const User = require('../models/user');
const Category = require('../models/category');

const google = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const plus = google.plus('v1');

const auth = {
    googleAuth: (req, reply) => {

        const oauth2_client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.BASE_URL + process.env.REDIRECT_URL
        );

        oauth2_client.getToken(req.payload.code, (err, tokens) => {
            oauth2_client.setCredentials(tokens);
            plus.people.get({ userId: 'me', auth: oauth2_client }, (err, profile) => {

                const jwt = require('../helpers/jwt');
                const email = profile.emails[0].value;

                User.findOne({'email': email}).then(user => {

                    if (user) {
                        // If user exists, give token
                        const token = {
                            email: email,
                            username: user.username,
                            id: user._id
                        };
                        return reply({ jwt: jwt.sign(token)});
                    } else {

                        // If user doesn't exist, return their email
                        const token = { email: email };
                        return reply({ email: jwt.sign(token)});
                    }
                }).catch(error => {
                    return reply(error);
                });

            });
        });
    },
    googleAuthCreate: (req, reply) => {

        if (!req.auth.credentials.email)
            return reply(Boom.unauthorized('Google user not authenticated.'));

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
                    email: req.auth.credentials.email,
                    username: req.payload.username,
                    categories: [new Category({name: 'main', color: 'blue'})],
                    googleOnly: true
                });
                return newUser.save();
            }

        }).then(user => {

            const token = {
                email: user.email,
                username: user.username,
                id: user._id
            };

            return reply({ jwt: jwtHelper.sign(token) });
        }).catch(error => {
            return reply(error);
        });
    },
    resetPassword: (req, reply) => {

        User.findOne({'email':req.payload.email}).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('Email not found.'));

            const jwt = jwtHelper.sign({ email: user.email });
            const resetPasswordUrl = `${process.env.BASE_URL}/reset-password-confirm/${jwt}`;
            const password = fs.readFile('./emailPassword', (err, data) => {
                const send = {
                    from: require('../../config').email.from,
                    to: user.email,
                    subject: 'Reset Password',
                    html: '<p>Click here <a href="' + resetPasswordUrl + '">here</a> to reset password.</p>'
                };
                const smtpConfig = {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: require('../../config').email.from,
                        pass: data
                    }
                };
                const transporter = require('nodemailer').createTransport(smtpConfig);

                transporter.sendMail(send, (err, info) => {
                    return reply();
                });
            });

        }).catch(error => {
            return reply(error);
        });
    },
    resetPasswordAuth: (req, reply) => {

        const key = fs.readFileSync(require('../../config').key);
        jsonwebtoken.verify(req.params.token, key, (err, decoded) => {
            User.findOne({ 'email': decoded.email }).then(user => {

                if (!user)
                    return Promise.reject(Boom.notFound('User not found'));

                const token = {
                    email: user.email,
                    username: user.username,
                    id: user._id,
                    passwordUpdate: true
                };
                return reply(jwtHelper.sign(token));
            }).catch(error => {
                return reply(error);
            });
        });
    },
    updatePassword: (req, reply) => {

        User.findOne({ 'email': req.auth.credentials.email }).then(user => {

            if (!user)
                return Promise.reject(Boom.notFound('User not found'));

            const token = {
                email: user.email,
                username: user.username,
                id: user._id,
                passwordUpdate: true
            };

            if (user.isValidPassword(req.payload.password))
                return reply({ jwt: jwtHelper.sign(token) });
            else
                return Promise.reject(Boom.unauthorized('Invalid password'));

        }).catch(error => {
            reply(error);
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
                return Promise.reject(Boom.notFound('User not found'));

            if (!user.password)
                return Promise.reject(Boom.conflict('No password for user. Must authenticate with Google.'));

            const token = {
                email: user.email,
                username: user.username,
                id: user._id
            };

            if (user.isValidPassword(req.payload.password))
                return reply({ jwt: jwtHelper.sign(token) });
            else
                return reply(Boom.unauthorized('Invalid password'));

        }).catch(error => {
            return reply(error);
        });
    }
};

module.exports = auth;
