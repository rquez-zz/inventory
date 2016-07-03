const mongoose = require('mongoose');

module.exports = mongoose.model('Category', require('./schema').category);
