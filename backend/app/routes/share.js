const shareHandler = require('../handlers/share');
const validator = require('../helpers/validator');

const share = [
    {
        method: 'POST',
        path: '/category/{cid}/share',
        handler: shareHandler.createShare,
        config: {
            validate: {
                payload: validator.createShare
            }
        }
    },
    {
        method: 'GET',
        path: '/category/{cid}/share/{friendUsername}',
        handler: shareHandler.getShare,
    },
    {
        method: 'DELETE',
        path: '/category/{cid}/share/{friendUsername}',
        handler: shareHandler.deleteShare,
    }
];

module.exports = share;
