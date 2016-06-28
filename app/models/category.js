const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true }
});

module.exports = CategorySchema;
