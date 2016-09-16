/*
    ==========example====================

*/
module.exports = function ($rootScope, $compile, utilitySrv, testSrv) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/sub_window.html'),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "="
        },
        link: function (scope, e, a) {
            // console.log($(e).find('.hourly-charts'))
            scope.myChart = echarts.init($(e).find('.hourly-charts').get(0));
            scope.getData = function (params) {
                var fnPromise,
                    service = testSrv,
                    fn = service[params.fn];
                switch (params.fn) {
                    case 'getVoCDetailsByDate':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.date,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                    case 'getVoCDetailsByPN':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                    case 'getVoCDetailsByServiceName':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.service,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                }
                fnPromise.then(function (data) {
                    scope.raw = data;
                    scope.tabledata = data.vocmentionedmost;
                    // if(!scope.table){
                    //     scope.table = $compile($(e).find('#thread-table').get(0))(scope)
                    // }else{
                    // }

                    // scope.users = data.topusers 
                    scope.$broadcast('set-user-data', data.topusers);
                    scope.$broadcast('set-sub-widows-charts-data', { data: data, pnscope: params.param.pnscope||'posi' });
                    scope.chartOpt = initHourlyChartData(data.volhourlylist, utilitySrv);
                    scope.myChart.setOption(scope.chartOpt);
                    scope.myChart.resize();
                })
            }
            scope.$on('start-get-data-in-window', function (event, arg) {
                scope.getData(arg);
            });
        }
    }
}

function initHourlyChartData(raw, utility) {
    var seriesData = [], xAxisDate = [];
    raw.map(function (item) {
        var tmp = {};
        xAxisDate.push(utility.timeToString(item.attachedobject));
        if (item.vocinfluence.detectedspikesvol) {
            var entity = {
                value: item.vocinfluence.voctotalvol,
                symbol: 'pin',
                symbolSize: 20,
                label: {
                    normal: {
                        show: true
                    }
                }
            };
        } else {
            var entity = {
                value: item.vocinfluence.voctotalvol,
                symbolSize: 0
            };
        }
        seriesData.push(entity);
    })
    var title = 'Hourly trend';
    var opt = {
        title: {
            text: title,
            textStyle: {
                fontSize: 12
            },
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        dataZoom: [{
            show: true,
            realtime: true,
            start: 0,
            end: 100
        }, {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: xAxisDate
        },
        yAxis: {},
        series: [{
            name: 'Vol',
            type: 'line',
            showAllSymbol: true,
            data: seriesData
        }]
    };
    return opt;
}