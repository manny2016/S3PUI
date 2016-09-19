/*
======================
example pie 
======================
$scope.config = {
        type: 'pie',
        series: [{
            data: [{
                value: 1024,
                name: 'POSI',
                itemStyle: {
                    normal: {
                        color: '#91c7ae'
                    }
                }
            }, {
                    value: 233,
                    name: 'NEG'
                }]
        }],
        title: {
            text: "hello world"
        }
    }


==========================
example axis
==========================
$scope.config={
        series:[{
            name: 'Vol',
            type: 'bar',
            data:[1,2,3,4,5]
        }],
        title:{
            text:"hello world"
        }
    } 

===========================
example connect
==========================
$scope.config={
 group:"chart-group",
 .....
 }
 echarts.connect('chart-group');

 **********************
 discarded above
 **********************

 @parameters:
    platform string
        all,twitter,so,sf,su,msdn,tn
    topic string
        all,azure,...
    pnscope string
        all,posi,neg
    days number
        7,14
    

*/

module.exports = function () {
    return {
        restrict: 'E',
        templateUrl: 'public/template/chart.html',
        replace: true,
        scope: {
            // config: "=",
            type:"@",
            platform:"@",
            topic:"@",
            pnscope:"@",
            days:"@",
            apiFn:"@",
            group:"@"
        },
        link: function (scope, element, attrs) {
            _ = scope;
            var apiFn = $scope.service[scope.apiFn] || $scope.service.getSpikes;
            console.log(typeof(apiFn))
            apiFn(_.platform).then(function(data){
                var seriesData = data.map(function (item) {
                    return item.dailyspikevol
                })
                console.log(seriesData);
            })
            // scope.config = scope.config || {};
            scope.initChartOpt = function () {
                // debugger;
                if (scope.type == 'pie') {
                    scope.chartOpt = initPieChartOpt(scope);
                } else {
                    scope.chartOpt = initChartOpt(scope);
                }
            } ()
            var echartDom = $(element).find("div.echart");
            // scope.chartOpt = angular.merge(scope.chartOpt, scope.config);
            scope.chartObj = echarts.init(echartDom[0]);
            // console.log(scope.chartOpt)
            // scope.chartObj.setOption(scope.chartOpt)
            if (_.group) {
                scope.chartObj.group = _.group
            }
        },
        // controller: "@",
        // name: "controller"
    }
}

function initChartOpt(scope) {
    var opt = {
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            trigger: 'axis',
            feature: {
                saveAsImage: { show: true, title: "Save as Image" }
            }
        },
        xAxis:{
            type: 'category',
            data: []
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: []
    };
    // if (scope.title) {
    //     opt.title = {
    //         text: scope.title,
    //     }
    //     if (scope.subtitle) opt.title.subtext = scope.subtitle;
    // }
    return opt;
}

function initPieChartOpt(scope) {
    var opt = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            show: true,
            orient: 'horizontal',
            //x: 'left',
            x: 'center',
            y: 'top',
            data: []
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
            }
        },
        series: [
            {
                name: 'Tech Scope Distribution',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: []
            }
        ]
    };
    // if (scope.title) {
    //     opt.title = {
    //         text: scope.title,
    //     }
    //     if (scope.subtitle) opt.title.subtext = scope.subtitle;
    // }
    return opt;
}