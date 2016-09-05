'use strict';

var app = angular.module('app.Route', [require('../../node_modules/angular-route')]);

app.config(function($routeProvider, $locationProvider){
    $routeProvider
   .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })
  .when('/social', {
    templateUrl: 'templates/social.html',
    controller: 'socialCtrl'
  })
  .otherwise('/');

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true).hashPrefix('!');
})
module.exports = 'app.Route';