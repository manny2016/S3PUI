var app = require('angular').module("app", [require('./controller'), require('./service'), require('./directive'),require('./app.route.js'), require('../../node_modules/angular-scroll')]);
app.
  run(function ($rootScope, utilitySrv) {
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
    $rootScope.test = function () {
      $rootScope.$broadcast('start-get-data', 'sub');
      $('.fullscreen.modal').modal({
        onVisible:function(e){
          $(this).find('.echart').map(function(i){
            echarts.getInstanceByDom(this).resize();
          })
        }
      }).modal('show');
    }
    // $(window).resize(function () {
    //   console.log(window.innerWidth);
    // })

  });

app.controller("testChartCtrl", function ($scope, $rootScope, $filter, testSrv) {
  // console.log($rootScope.dateList);
  testSrv.getSpikes().then(function (data) {
    var seriesData = data.map(function (item) {
      return item.dailyspikevol
    })
    // console.log(seriesData)
    $scope.config = {
      xAxis: { data: $rootScope.dateList },
      series: [{
        name: 'Spikes',
        type: 'bar',
        data: seriesData
      }],
      title: {
        text: 'Daily Spikes in Test'
      }
    };
    $scope.chartOpt = angular.merge($scope.chartOpt, $scope.config);
    // console.log($scope.chartOpt)
    $scope.chartObj.setOption($scope.chartOpt)
    if ($scope.config.group) {
      $scope.chartObj.group = $scope.config.group
    }
  })
});
 
app.controller("testPieChartCtrl", function ($scope, $rootScope, $filter, testSrv) {
  // console.log($rootScope.dateList);
  testSrv.getDistribution().then(function (data) {
    $scope.config = {
      series: [{
        data: [{
          value: data.positivetotalvol,
          name: 'POSI',
          itemStyle: {
            normal: {
              color: '#91c7ae'
            }
          }
        }, {
            value: data.negativetotalvol,
            name: 'NEG'
          }]
      }],
      title: {
        text: 'Positive & Negative Vol Distribution'
      }
    };
    $scope.chartOpt = angular.merge($scope.chartOpt, $scope.config);
    console.log($scope.chartOpt)
    $scope.chartObj.setOption($scope.chartOpt)
    if ($scope.config.group) {
      $scope.chartObj.group = $scope.config.group
    }
  });
});