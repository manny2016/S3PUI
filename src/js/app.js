moment = require('moment-timezone');
var app = angular.module("app", [
  require('ui-select'),
  require('./controller'), require('./service'), require('./directive'), require('./filter'), require('./app.route.js'), require('./app.constants.js'), 'duScroll', 'smart-table', 'toastr'
]);
app
  .config(function (toastrConfig) {
      angular.extend(toastrConfig, {
          autoDismiss: false,
          containerId: 'toast-container',
          maxOpened: 5,
          newestOnTop: true,
          positionClass: 'toast-bottom-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          target: 'body'
      });
  })
  .run(function ($rootScope, $window, $state, $stateParams, $injector, adalAuthenticationService, utilitySrv, CONST, Notifications, $http) {
      // var config = require('../../public/config');
      //check authentication
      $rootScope.CONST = CONST;
      $rootScope.TZ = moment.tz(moment.tz.guess()).format('z');
      $rootScope.Notifications = Notifications;
      $rootScope.service = $injector.get('rawdataSrv');
      $rootScope.service.checkAdminAccessRights($rootScope.userInfo.userName).then(function (data) {
          $rootScope.isAdmin = data;
      })
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      //global variables
      $rootScope.global = {
          topic: ''
      }
      $rootScope.signOut = function () {
          adalAuthenticationService.logOut();
      }
      $rootScope.signIn = function () {
          adalAuthenticationService.login();
      }
      // $rootScope.timeRange = {
      //   'start': (function (d) {
      //     d.setDate(d.getDate() - 7);
      //     return d.setHours(0, 0, 0, 0)
      //   })(new Date),
      //   'end': (function (d) {
      //     d.setDate(d.getDate() - 1);
      //     return d.setHours(0, 0, 0, 0)
      //   })(new Date)
      // };

      if (!window.history || !history.replaceState) {
          return;
      };
      $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
          //Automaticly update location 
          // debugger;
          // $($target).siblings('.segment').dimmer('show')
          // $($target).dimmer('hide');
          var color = $element.find("div").attr('set-color');
          $($element.find("div")).addClass(color);
          var siblings = $element.parent().siblings();
          var labels = $(siblings).find("div.ui.label");
          for (var i = 0; i < labels.length; i++) {
              var e = $(labels.get(i));
              e.removeClass(e.attr('set-color'))
          }
          var hash = $element.prop('hash');
          if (hash) {
              history.replaceState(null, null, hash);
          }
      });
      $rootScope.popSubWin = function (params) {
          $rootScope.$broadcast('start-get-data-in-window', params);
          $('.fullscreen.modal').find('div.echart').map(function () {
              echarts.getInstanceByDom(this).clear();
          })
          $('.fullscreen.modal').modal({
              observeChanges: true,
              onVisible: function (e) {
                  $('#sub_window').height($(window).height() * 0.72)
                  $(this).find('.echart').map(function (i) {
                      echarts.getInstanceByDom(this).resize();
                  })
              },
              onHidden: function () {
                  $(this).find('.echart').map(function (i) {
                      echarts.getInstanceByDom(this).clear();
                  })
              }
          }).modal('show');
          // $('.fullscreen.modal').modal('show');          
      }
      $rootScope.init = function () {
          // $('.menu').find('.ui.dropdown.item').dropdown();
          // $('.fullscreen.modal').modal({
          //   observeChanges: true,
          //   onVisible: function (e) {
          //     $(this).find('#sub_window').height($(window).height() * 0.7)
          //     $(this).find('.echart').map(function (i) {
          //       echarts.getInstanceByDom(this).clear();
          //       echarts.getInstanceByDom(this).resize();
          //     })
          //   },
          //   onHidden: function () {
          //     $(this).find('.echart').map(function (i) {
          //       echarts.getInstanceByDom(this).clear();
          //     })
          //   }
          // });
      }


  });

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value;
};