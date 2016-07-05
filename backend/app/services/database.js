const config = require('./../../config');

const mongoose = require('mongoose');

mongoose.connect(config.mongodb);

mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', (err) => {
    console.log('Mongoose default connection disconnected: ' + err);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
