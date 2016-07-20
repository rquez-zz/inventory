require('angular');
require('satellizer');
require('angular-ui-router');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-material-data-table');

const app = angular.module('app', ['satellizer', 'ui.router', 'ngAria', 'ngAnimate', 'ngMaterial', 'md.data.table']);

app.config(($authProvider) => {
    $authProvider.google({
        clientId: '200825012213-1ldarco8c4p6s4f8pg9e5bdkvt7aa8q3.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/auth',
        url: '/auth'
    });
});

app.controller('AuthController', ['$scope', '$window', '$auth', '$http', AuthController]);
app.controller('UserController', ['$scope', '$window', '$http', UserController]);
