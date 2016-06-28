const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String, default: 'main' }
});

module.exports = ItemSchema;
