const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CategorySchema = require('./category.js');
const ItemSchema = require('./item.js');

const UserSchema = mongoose.Schema({
    password: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    inventory: [ItemSchema],
    categories: [CategorySchema],
    sharedFrom: [{ type: String, required: true }],
    sharedTo: [{ type: String, required: true }],
});

UserSchema.statics.hashPassword = function(password) {
    const salt = bcrypt.genSaltSync(require('./../../config').bcrypt);
    return bcrypt.hashSync(password, salt);
};

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = UserSchema;
