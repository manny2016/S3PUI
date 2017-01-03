module.exports = function ($scope, $rootScope, $timeout, $filter, $document, $location,utilitySrv) {
    $scope.platform = $scope.$stateParams.platform.toLowerCase();
    $scope.order = $filter('orderBy');
    $scope.query = {};
    $scope.path = $location.path().split("/");
    $scope.dateRange = '7';
    $scope.isLargeDateRange = false;
    $scope.commonTrendTitle = "Hourly Trend During a Week";
    var totalrequests = 0;
    // debugger;
    switch ($scope.platform) {
        case 'twitter':
            totalrequests = 14;
            break;
        default:
            totalrequests = 15;
            break;
    }
    $('#progress').progress({
        total: totalrequests
    });
    $('.ui.accordion').accordion({
        exclusive: false,
        // debug:true,
        animateChildren: false,
        selector: {
            trigger: '.segment .title',
            content: '.segment'
        },
        onOpen: function () {
            // debugger;
            $(this).find('div.echart').map(function (index, currentObj, array) {
                echarts.getInstanceByDom(currentObj).resize();
            })
        }
    })
    $('#server_status').popup({
        inline: true,
        hoverable: true,
        position: 'bottom left'
    })
    $scope.flags = {
        m: false,
        g: false,
        r: false
    };
    $('#topicSelection').dropdown({
        onChange: function (value, text, $selectedItem) {
            // console.log(value)
            $scope.topic = value;
            $scope.startGetData()
        }
    });
    $('#dataRangeSelection').dropdown('set selected', '7').dropdown({
        onChange: function (value, text, $selectedItem) {
            $scope.dateRange = value;
            if (value !== '7') {
                $scope.isLargeDateRange = true;
            } else {
                $scope.isLargeDateRange = false;
            }
            $timeout(function () {
                $('.large-date-range').find('div.echart').map(function (index, currentObj, array) {
                    echarts.getInstanceByDom(currentObj).resize();
                })
            }, 0)
            $scope.$apply()
        }
    });
    $scope.$watch('dateRange', function (newV, oldV) {
        $scope.commonTrendTitle = "Daily Trend In Last " + newV + " Days";
        var timeRange = {
            'start': (function (d) {
                d.setDate(d.getDate() - parseInt(newV));
                return d.setHours(0, 0, 0, 0)
            })(new Date),
            'end': (function (d) {
                d.setDate(d.getDate() - 1);
                return d.setHours(0, 0, 0, 0)
            })(new Date)
        };
        $scope.dateList = utilitySrv.getTimeRange(timeRange.start, timeRange.end);
        if (newV !== '7') {
            $timeout(function () {
                $('.large-date-range').find('div.echart').map(function (index, currentObj, array) {
                    echarts.getInstanceByDom(currentObj).resize();
                })
            }, 0)
        }
    })
    $('#scrollspy .list .item .label').popup();
    $('#topic_select').dimmer('show');
    $scope.getTopics = function () {
        $scope.service.getCate($scope.$stateParams.platform).then(function (data) {
            $scope.topics = []
            data.map(function (item) {
                // console.log(item.Platforms)
                var flage = false;
                item.Platforms.map(function (obj) {
                        if (obj.PlatformName.toLowerCase() == $scope.$stateParams.platform) {
                            flage = obj.isEnabled;
                        }
                    })
                    // console.log(item.TechCategoryName,flage)
                if (flage) $scope.topics.push(item.TechCategoryName)
            })
            $('#topic_select').dimmer('hide');
            if ($scope.topics.indexOf($rootScope.global.topic) !== -1) {
                $scope.topic = $rootScope.global.topic;
                $scope.startGetData()
                $('#topicSelection').dropdown('set text', $rootScope.global.topic)
            }
        })
    }
    $scope.getTopics();
    // var count = 0;
    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
        // console.log(++count);
        //$scope.$broadcast('on-show');
        $('#progress').progress('increment');
        //console.log($('#progress').progress('get value'))
        if ($('#progress').progress('get value') === totalrequests) {
            $timeout(function () {
                $('#progress').hide()
                    // $('#summary').dimmer('hide');
                    // var firstSection = angular.element(document.getElementById('summary'));
                    // $document.scrollToElementAnimated(firstSection);
            }, 1000)
        }
        //$timeout(function () {
        //    //console.log(arg)
        //    arg.resize();
        //},500)
    });
    $scope.getMentionedServiceTable = function (platform, topic) {
        $scope.service.getMentionedMostServiceList(platform, topic).then(function (data) {
            // detect server status

            // $scope.mostMentionedService = $scope.order(data,'-vocinfluence.voctotalvol');
            $scope.mostMentionedService = data
            $scope.$broadcast('data-got');
        })
    }

    $scope.startGetData = function () {
            // $event.stopPropagation();
            // $event.preventDefault();
            // console.log($scope.topic)
            if (!$scope.topic) {
                alert('Need to select a topic!');
                return false;
            }
            $rootScope.global.topic = $scope.topic;
            $scope.flags.m = false;
            $('div.echart').map(function () {
                echarts.getInstanceByDom(this).clear();
            })
            $('#progress').progress('reset');
            $('#progress').show();
            $scope.query.topic = $scope.topic;
            $scope.getStatistic($scope.$stateParams.platform, $scope.topic)
            $scope.getMentionedServiceTable($scope.$stateParams.platform, $scope.topic)
            $scope.$broadcast('start-get-data', 'home');
        }
        // initLineCharts('.hourly-charts.home');
        // echarts.connect('hourlyCharts');
    $scope.getStatistic = function (platform, topic, pnscope, days) {
        $scope.service.getImpactSummary(platform, topic, pnscope, days).then(function (data) {
            // console.log(data);
            var influenceData = data.vocinsights.objectcountthistime;
            $scope.serviceStatus = 'gery';
            var flag_spike = influenceData.detectedspikesvol > 0;
            var flag_health = influenceData.positivetotalvol < influenceData.negativetotalvol;
            console.log(flag_spike, flag_health)
            if (flag_spike && flag_health) {
                $scope.serviceStatus = 'red';
            }
            if (flag_spike || flag_health) {
                $scope.serviceStatus = 'yellow';
            }
            if (!flag_spike && !flag_health) {
                $scope.serviceStatus = 'green';
            }
            $scope.statistic = data;
            $scope.$broadcast('data-got');
        })
    };

    //test language distribution fake data
    $scope.languageDistribution = [{
        attachedobject: 'Chinese',
        vocinfluence: {
            voctotalvol: 95502120230,
            ratio: 0.331
        }
    }, {
        attachedobject: 'English',
        vocinfluence: {
            voctotalvol: 33502120230,
            ratio: 0.111
        }
    }, {
        attachedobject: 'Arabic',
        vocinfluence: {
            voctotalvol: 30002120230,
            ratio: 0.101
        }
    }, {
        attachedobject: 'Portuguese',
        vocinfluence: {
            voctotalvol: 22002120230,
            ratio: 0.091
        }
    }]

}

function initLineCharts(className) {
    var doms = $(className);
    var title = 'Hourly trend';
    var titles = [
        'Users\' Vol Hourly Trend During a Week',
        'Message Posts\' Vol Hourly Trend During a Week',
        'Positive Posts\' Vol Hourly Trend During a Week',
        'Negative Posts\' Vol Hourly Trend During a Week',
        'Message Influence Vol Hourly Trend During a Week',
        'Poster\'s Regions # Hourly Trend During a Week'
    ];
    for (var i = 0; i < doms.length; i++) {
        var myChart = echarts.init(doms.get(i));
        // 绘制图表
        myChart.setOption({
            title: {
                text: titles[i],
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
                data: ['2009/7/1 0:00', '2009/7/1 1:00', '2009/7/1 2:00', '2009/7/1 3:00', '2009/7/1 4:00', '2009/7/1 5:00', '2009/7/1 6:00', '2009/7/1 7:00', '2009/7/1 8:00', '2009/7/1 9:00', '2009/7/1 10:00', '2009/7/1 11:00', '2009/7/1 12:00', '2009/7/1 13:00', '2009/7/1 14:00', '2009/7/1 15:00', '2009/7/1 16:00', '2009/7/1 17:00', '2009/7/1 18:00', '2009/7/1 19:00', '2009/7/1 20:00', '2009/7/1 21:00', '2009/7/1 22:00', '2009/7/1 23:00',
                    '2009/7/2 0:00', '2009/7/2 1:00', '2009/7/2 2:00', '2009/7/2 3:00', '2009/7/2 4:00', '2009/7/2 5:00', '2009/7/2 6:00', '2009/7/2 7:00', '2009/7/2 8:00', '2009/7/2 9:00', '2009/7/2 10:00', '2009/7/2 11:00', '2009/7/2 12:00', '2009/7/2 13:00', '2009/7/2 14:00', '2009/7/2 15:00', '2009/7/2 16:00', '2009/7/2 17:00', '2009/7/2 18:00', '2009/7/2 19:00', '2009/7/2 20:00', '2009/7/2 21:00', '2009/7/2 22:00', '2009/7/2 23:00',
                    '2009/7/3 0:00', '2009/7/3 1:00', '2009/7/3 2:00', '2009/7/3 3:00', '2009/7/3 4:00', '2009/7/3 5:00', '2009/7/3 6:00', '2009/7/3 7:00', '2009/7/3 8:00', '2009/7/3 9:00', '2009/7/3 10:00', '2009/7/3 11:00', '2009/7/3 12:00', '2009/7/3 13:00', '2009/7/3 14:00', '2009/7/3 15:00', '2009/7/3 16:00', '2009/7/3 17:00', '2009/7/3 18:00', '2009/7/3 19:00', '2009/7/3 20:00', '2009/7/3 21:00', '2009/7/3 22:00', '2009/7/3 23:00',
                    '2009/7/4 0:00', '2009/7/4 1:00', '2009/7/4 2:00', '2009/7/4 3:00', '2009/7/4 4:00', '2009/7/4 5:00', '2009/7/4 6:00', '2009/7/4 7:00', '2009/7/4 8:00', '2009/7/4 9:00', '2009/7/4 10:00', '2009/7/4 11:00', '2009/7/4 12:00', '2009/7/4 13:00', '2009/7/4 14:00', '2009/7/4 15:00', '2009/7/4 16:00', '2009/7/4 17:00', '2009/7/4 18:00', '2009/7/4 19:00', '2009/7/4 20:00', '2009/7/4 21:00', '2009/7/4 22:00', '2009/7/4 23:00',
                    '2009/7/5 0:00', '2009/7/5 1:00', '2009/7/5 2:00', '2009/7/5 3:00', '2009/7/5 4:00', '2009/7/5 5:00', '2009/7/5 6:00', '2009/7/5 7:00', '2009/7/5 8:00', '2009/7/5 9:00', '2009/7/5 10:00', '2009/7/5 11:00', '2009/7/5 12:00', '2009/7/5 13:00', '2009/7/5 14:00', '2009/7/5 15:00', '2009/7/5 16:00', '2009/7/5 17:00', '2009/7/5 18:00', '2009/7/5 19:00', '2009/7/5 20:00', '2009/7/5 21:00', '2009/7/5 22:00', '2009/7/5 23:00',
                    '2009/7/6 0:00', '2009/7/6 1:00', '2009/7/6 2:00', '2009/7/6 3:00', '2009/7/6 4:00', '2009/7/6 5:00', '2009/7/6 6:00', '2009/7/6 7:00', '2009/7/6 8:00', '2009/7/6 9:00', '2009/7/6 10:00', '2009/7/6 11:00', '2009/7/6 12:00', '2009/7/6 13:00', '2009/7/6 14:00', '2009/7/6 15:00', '2009/7/6 16:00', '2009/7/6 17:00', '2009/7/6 18:00', '2009/7/6 19:00', '2009/7/6 20:00', '2009/7/6 21:00', '2009/7/6 22:00', '2009/7/6 23:00', '2009/7/7 0:00', '2009/7/7 1:00', '2009/7/7 2:00', '2009/7/7 3:00', '2009/7/7 4:00', '2009/7/7 5:00', '2009/7/7 6:00', '2009/7/7 7:00', '2009/7/7 8:00', '2009/7/7 9:00', '2009/7/7 10:00', '2009/7/7 11:00', '2009/7/7 12:00', '2009/7/7 13:00', '2009/7/7 14:00', '2009/7/7 15:00', '2009/7/7 16:00', '2009/7/7 17:00', '2009/7/7 18:00', '2009/7/7 19:00', '2009/7/7 20:00', '2009/7/7 21:00', '2009/7/7 22:00', '2009/7/7 23:00'
                ]
            },
            yAxis: {},
            series: [{
                name: 'Vol',
                type: 'line',
                data: rangeData(168, 10)
            }]
        });

        myChart.group = 'hourlyCharts';
    }
}

function rangeData(num, radix) {
    var radix = radix || 10;
    if (parseInt(num) == 1) {
        return parseInt(Math.random() * radix)
    } else {
        var tmp = [];
        for (var i = 0; i < num; i++) {
            tmp.push(parseInt(Math.random() * radix))
        }
        return tmp;
    }
}