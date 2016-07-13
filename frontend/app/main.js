require('angular');
require('angular-resource');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');

const app = angular.module('app', ['ngResource']);

app.constant('BASE', 'http://localhost:3000');

app.factory('User', ($resource, BASE) => {
    return $resource(BASE + '/user/:id', {id:'@id'});
});

app.controller('AuthController', ['$scope', '$http', 'BASE', AuthController]);
app.controller('UserController', ['$scope', 'User', UserController]);
