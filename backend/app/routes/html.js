const html = [
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
                listing: true
            }
        },
        config: { auth: false }
    },
];

module.exports = html;
