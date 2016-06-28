const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const CategorySchema = require('./category.js');
const ItemSchema = require('./item.js');

const UserSchema = mongoose.Schema({
    password: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    inventory: [ItemSchema],
    categories: [CategorySchema]
});

UserSchema.statics.hashPassword = function(password) {
    const config = require('../config/rpgify');
    return bcrypt.hashSync(password, config.bcrypt.workFactor);
};

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = UserSchema;
