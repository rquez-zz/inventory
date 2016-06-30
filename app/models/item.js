const mongoose = require('mongoose');

const ReminderSchema = require('./reminder.js');

const ItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    category: { type: String, default: 'main' },
    reminder: ReminderSchema
});

module.exports = ItemSchema;
