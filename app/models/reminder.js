const mongoose = require('mongoose');

const ReminderSchema = mongoose.Schema({
    message: { type: String, required: true },
    date: { type: Date, required: true }
});

module.exports = ReminderSchema
