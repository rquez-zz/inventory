const jwt = require('jsonwebtoken');
const fs = require('fs');

const key = fs.readFileSync('privateKey');

const jwtHelper = {
    validateToken: (request, decoded, callback) => {

        if (!decoded) {
            return callback(null, false, decoded);
        }
        return callback(null, true, decoded);
    },
    sign: (token) => {
        return jwt.sign(token, key, { issuer: 'inventory' });
    }
};

module.exports = jwtHelper;
