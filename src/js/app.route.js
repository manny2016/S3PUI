'use strict';
require('angular-ui-router');
var app = angular.module('app.Route', ['ui.router']);

app
  
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when("", "/home/about");
    $urlRouterProvider.when("/", "/home/about");

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/home/about");

    $stateProvider
      .state('home', {
        abstract: true,
        url: '/home',
        template: '<ui-view/>'
      })
      .state('home.about', {
        url: '/about',
        templateUrl: 'templates/home.html'
      })
      .state('home.dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        controller: 'homeCtrl'
      })
      .state('social', {
        abstract: true,
        url: '/social',
        template: '<ui-view/>'
      })
      .state('social.platform',{
        url:'/:platform',
        templateUrl: 'templates/social.test.html',
        controller: 'socialCtrl'
      })
      .state('thirdParty', {
        abstract: true,
        url: '/thirdParty',
        template: '<ui-view/>'
      })
      .state('thirdParty.platform',{
        url:'/:platform',
        templateUrl: 'templates/social.test.html',
        // controller: 'thirdPartyCtrl'
        controller: 'socialCtrl'
      })
      .state('msPlatform', {
        abstract: true,
        url: '/msPlatform',
        template: '<ui-view/>'
      })
      .state('msPlatform.platform',{
        url:'/:platform',
        templateUrl: 'templates/social.test.html',
        // controller: 'msPlatformCtrl'
        controller: 'socialCtrl'
      });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
module.exports = 'app.Route';