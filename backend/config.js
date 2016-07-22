var env = process.env;

const config = {
    connection: {
        host: env.HOST || 'localhost',
        port: env.PORT || 3000,
    },
    protocol: env.PROTOCOL || 'http',
    mongodb: env.MONGO_URL || 'mongodb://localhost/inventory',
    bcrypt: env.WORK_FACTOR || 10,
    key: env.PRIVATE_KEY || 'privateKey',
    google: {
        key: env.GOOGLE_KEY || 'googleApiKey.json'
    },
    email: {
        from: 'inventory.emailer@gmail.com'
    }
};

module.exports = config;
