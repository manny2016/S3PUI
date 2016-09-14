module.exports = function ($scope, $timeout, $document,rawdataSrv, testSrv) {
    $scope.query = {};
    console.log($scope.$stateParams.platform)
    var totalrequests = 4;
    $('#progress').progress({
        total: totalrequests
    });
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
    $('.ui.segment').find('.ui.dropdown').dropdown();
    $('#scrollspy .list .item .label').popup();
    $document.scrollTopAnimated(10);
    $scope.statistic = {
        title: 'Users Joined Discussion',
        volume: 3424,
        comment: 'Page Views - POST : NEG',
        labels: [{
            append: 1,
            color: 'red',
            icon: 1,
            text: 12
        }, {
                append: 0,
                color: 'green',
                icon: 0,
                text: 13
            }]
    }

    $scope.getTopics = function(){
        testSrv.getCate().then(function(data){
            $scope.topics = []
            data.map(function(item){
                // console.log(item.Platforms)
                var flage = false;
                item.Platforms.map(function(obj){
                    if(obj.PlatformName.toLowerCase() == $scope.$stateParams.platform){
                        flage = obj.isEnabled;
                    }
                })
                console.log(item.TechCategoryName,flage)
                if(flage) $scope.topics.push(item.TechCategoryName)
            })
            
        })
    }
    $scope.getTopics();
    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
        //$scope.$broadcast('on-show');
        $('#progress').progress('increment');
        //console.log($('#progress').progress('get value'))
        if ($('#progress').progress('get value') === totalrequests) {
            $timeout(function () {
                $('#progress').hide()
            }, 1000)
        }
        //$timeout(function () {
        //    //console.log(arg)
        //    arg.resize();
        //},500)
    });

    $scope.startGetData = function (topic, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        $scope.flags.m = false;
        $('div.echart').map(function () {
            echarts.getInstanceByDom(this).clear();
        })
        $('#progress').progress('reset');
        $('#progress').show();
        $scope.query.topic = topic;
        $scope.$broadcast('start-get-data', 'home');
    }
    initLineCharts('.hourly-charts.home');
    echarts.connect('hourlyCharts');

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