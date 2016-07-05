const shareHandler = require('../handlers/share');

const share = [
    {
        method: 'POST',
        path: '/category/{cid}/share',
        handler: shareHandler.createShare,
    },
    {
        method: 'GET',
        path: '/category/{cid}/share/{tid}',
        handler: shareHandler.getShare,
    },
    {
        method: 'DELETE',
        path: '/category/{cid}/share/{tid}',
        handler: shareHandler.deleteShare,
    }
];

module.exports = share;
