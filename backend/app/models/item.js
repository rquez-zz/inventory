const mongoose = require('mongoose');

module.exports = mongoose.model('Item', require('./schema').item);
