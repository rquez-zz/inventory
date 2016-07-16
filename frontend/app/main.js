require('angular');
require('angular-touch');
require('angular-animate');
require('angular-ui-bootstrap');
require('satellizer');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');

const app = angular.module('app', ['satellizer', 'ui.bootstrap']);

app.config(($authProvider) => {
    $authProvider.google({
        clientId: '200825012213-1ldarco8c4p6s4f8pg9e5bdkvt7aa8q3.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/auth',
        url: '/auth'
    });
});

app.controller('AuthController', ['$scope', '$window', '$auth', '$http', AuthController]);
app.controller('UserController', ['$scope', '$window', '$http', UserController]);
