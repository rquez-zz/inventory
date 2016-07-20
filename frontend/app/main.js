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

app.filter('join', () => {
    return (array, separator, prop) => {
        if (!Array.isArray(array)) {
            return array;
        }

        return (!!prop ? array.map(item => {
            return item[prop];
        }) : array).join(separator);
    };
});

app.controller('LoginController',
        ['$scope', '$window', '$auth', '$http', '$state', '$mdDialog', require('./controllers/LoginController')]);

app.controller('DashboardController',
        ['$scope', '$http', '$window', '$timeout', '$mdSidenav', '$mdDialog', require('./controllers/DashboardController')]);

app.config(($authProvider, $stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: './views/login.html',
            controller: 'LoginController',
            data: {
              title: 'Login'
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: './views/dashboard.html',
            controller: 'DashboardController',
            data: {
              title: 'Dashboard'
            }
        });
    $urlRouterProvider.otherwise('/login');
});
