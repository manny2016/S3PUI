var app = require('angular').module("app", [
  require('./controller'), require('./service'), require('./directive'), require('./filter'), require('./app.route.js')
  , require('../../node_modules/angular-scroll'),require('angular-smart-table')
]);
app
.run(function ($rootScope, $state, $stateParams, $injector, utilitySrv) {
    // var config = require('../../public/config');
    // console.log(config);
    var config = {
      mode:'prod'
    }
    if(config.mode==='dev'){
      $rootScope.service = $injector.get('testSrv')
    }else{
      $rootScope.service = $injector.get('rawdataSrv')
    }
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    //global variables
    $rootScope.global = {
      topic:''
    }

    $rootScope.timeRange = {
      'start': (function (d) { d.setDate(d.getDate() - 7); return d.setHours(0, 0, 0, 0) })(new Date),
      'end': (function (d) { d.setDate(d.getDate() - 1); return d.setHours(0, 0, 0, 0) })(new Date)
    };
    $rootScope.dateList = utilitySrv.getTimeRange($rootScope.timeRange.start, $rootScope.timeRange.end)
    if (!window.history || !history.replaceState) {
      return;
    };
    $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
      //Automaticly update location 
      // debugger;
      // console.log($($target).siblings('.segment'))
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
      $('.fullscreen.modal').modal('show');
    }
    // $(window).resize(function () {
    //   console.log(window.innerWidth);
    // })
    $rootScope.init = function () {
      // $('.menu').find('.ui.dropdown.item').dropdown();
      $('.fullscreen.modal').modal({
        observeChanges: true,
        onVisible: function (e) {
          $(this).find('.echart').map(function (i) {
            echarts.getInstanceByDom(this).resize();
          })
        },
        onHidden: function () {
          $(this).find('.echart').map(function (i) {
            echarts.getInstanceByDom(this).clear();
          })
        }
      });
    }
    $rootScope.init();
  });
