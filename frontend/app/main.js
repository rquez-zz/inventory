const angular = require('angular');

const AuthController = require('./controllers/AuthController');

const app = angular.module('app', ['ngResource']);

// TODO: Make this an env
app.constant('BACK', 'http://localhost:3000');

app.controller('AuthController', ['$scope', '$http', 'BACK', AuthController]);
