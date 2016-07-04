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
        key: env.GOOGLE_KEY || 'googleApiKey.json',
        opts: {
            REDIRECT_URL: '/auth',
            handler: require('./app/handlers/auth').authCallback,
            scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
        }
    },
    email: {
        from: 'inventory.emailer@gmail.com'
    }
};

module.exports = config;
