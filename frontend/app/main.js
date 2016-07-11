require('angular');

const MainController = require('./controllers/MainController');

const app = angular.module('app', []);
app.controller('MainController', ['$scope', MainController]);
