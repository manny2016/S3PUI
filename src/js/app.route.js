require('angular-ui-router');
// window.AuthenticationContext = require('adal-angular');
// require('adal-angular/lib/adal-angular');
Logging = {
level: 3,
log: function (message) {
console.log(message);
}
};
var app = angular.module('app.Route', ['ui.router', 'AdalAngular', 'app.Constant']);
app
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, adalAuthenticationServiceProvider, $httpProvider, CONST) {

    // configure html5 to get links working on jsfiddle
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   // requireBase: false
    // }).hashPrefix('!');

    // $urlRouterProvider.when("", "/home/dashboard");
    // $urlRouterProvider.when("/", "/home/dashboard");

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/home/dashboard");

    $stateProvider
      .state('login', {
        url: '/',
        template: '<div></div>',
        requireADLogin: true,
        controller: function ($scope, $state, adalAuthenticationService) {
          if ($scope.userInfo.isAuthenticated) {
            $state.go("home.dashboard");
          } else {
            adalAuthenticationService.login();
          }
        }
      })
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
        requireADLogin: true,
        templateUrl: 'templates/dashboard.html',
        controller: 'homeCtrl'
      })
      .state('social', {
        abstract: true,
        url: '/social',
        template: '<ui-view/>'
      })
      .state('social.platform', {
        url: '/:platform',
        requireADLogin: true,
        templateUrl: 'templates/social.test.html',
        controller: 'socialCtrl'
      })
      .state('thirdParty', {
        abstract: true,
        url: '/thirdParty',
        template: '<ui-view/>'
      })
      .state('thirdParty.platform', {
        url: '/:platform',
        requireADLogin: true,
        templateUrl: 'templates/social.html',
        // controller: 'thirdPartyCtrl'
        controller: 'socialCtrl'
      })
      .state('msPlatform', {
        abstract: true,
        url: '/msPlatform',
        template: '<ui-view/>'
      })
      .state('msPlatform.platform', {
        url: '/:platform',
        requireADLogin: true,
        templateUrl: 'templates/social.html',
        // controller: 'msPlatformCtrl'
        controller: 'socialCtrl'
      })
      .state('admin', {
        url: '/admin',
        requireADLogin: true,
        controller: 'adminCtrl',
        templateUrl: 'templates/admin.html'
      })
      .state('notification', {
        url: '/notification',
        controller: 'notificationCtrl',
        templateUrl: 'templates/notification_center.html',
        requireADLogin: true
      });
    var endpoints = {
      'https://garyphp.azurewebsites.net': CONST.AD_CONFIG.CLIENT_ID
    }
    adalAuthenticationServiceProvider.init({
        // instance: 'https://login.microsoftonline.com/',
        tenant: CONST.AD_CONFIG.TENANT_ID,
        clientId: CONST.AD_CONFIG.CLIENT_ID,
        endpoints: endpoints,
        cacheLocation: 'localStorage',
        extraQueryParameter: 'nux=1',
        // redirectUri: window.location.origin,
        // displayCall: function (urlNavigate) {
        //   var popupWindow = window.open(urlNavigate, "login", 'width=483, height=600');
        //   if (popupWindow && popupWindow.focus)
        //     popupWindow.focus();
        //   var registeredRedirectUri = this.redirectUri;
        //   var pollTimer = window.setInterval(function () {
        //     if (!popupWindow || popupWindow.closed || popupWindow.closed === undefined) {
        //       window.clearInterval(pollTimer);
        //     }
        //     try {
        //       if (popupWindow.document.URL.indexOf(registeredRedirectUri) != -1) {
        //         window.clearInterval(pollTimer);
        //         window.location.hash = popupWindow.location.hash;
        //         popupWindow.close();
        //       }
        //     } catch (e) {}
        //   }, 20);
        // },
        // popUp:true,
        anonymousEndpoints: ['public/', 'templates/']
      },
      $httpProvider);
  })
  .run(function ($rootScope, $state, adalAuthenticationService) {
    if ((!$rootScope.userInfo.isAuthenticated) && (window.location.pathname !== "/")) {
      $state.go("login");
    }
  })
module.exports = 'app.Route';