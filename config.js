var env = process.env;

const config = {
    connection: {
        host: env.HOST || 'localhost',
        port: env.PORT || 3000,
    },
    mongodb: env.MONGO_URL || 'mongodb://localhost/inventory'
};

module.exports = config;
