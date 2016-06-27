var env = process.env;

const config = {
    connection: {
        host: env.HOST || 'localhost',
        port: env.PORT || 3000,
    }
};

module.exports = config;
