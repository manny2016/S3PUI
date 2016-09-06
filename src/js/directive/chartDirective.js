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

module.exports = function ($rootScope, testSrv) {
    return {
        restrict: 'E',
        templateUrl: 'public/template/chart.html',
        replace: true,
        scope: {
            // config: "=",
            title: "@",
            type: "@",
            platform: "@",
            topic: "@",
            pnscope: "@",
            propertySelect: "@",
            days: "@",
            apiFn: "@",
            group: "@"
        },
        link: function (scope, element, attrs) {
            var _ = scope;
            _.initChartOpt = function () {
                switch (_.type) {
                    case 'pie':
                        _.chartOpt = initPieChartOpt(_);
                        break;
                    case 'hori':
                        _.chartOpt = initHoriChartOpt(_);
                        break;
                    case 'wordcloud':
                        _.chartOpt = initCloudWordChartOpt(_);
                        break;
                    default:
                        _.chartOpt = initAxisChartOpt(_);
                        break;
                }
            } ();

            var echartDom = $(element).find("div.echart");
            _.chartObj = echarts.init(echartDom[0], 'macarons');

            var apiFn = testSrv[_.apiFn];
            switch (_.apiFn) {
                case 'getSpikes':
                    _.platforms = _.platform.split(",");
                    if (_.platforms.length == 1) {
                        var fnPromise = apiFn(_.platform, _.topic, _.days);
                        customSpikesData(fnPromise, _).then(function (config) {
                            _.chartOpt = angular.merge(_.chartOpt, config);
                            initChart(_.chartObj, _.chartOpt, _.group);
                        })
                    }else{
                        var fnPromises = _.platforms.map(function(item){
                            return apiFn(item, _.topic, _.days);
                        })
                        console.log(fnPromises);
                    }

                    break;
                case 'getDistribution':
                    var fnPromise = apiFn(_.platform, _.toppic);
                    customDistributionData(fnPromise, _).then(function (config) {
                        _.chartOpt = angular.merge(_.chartOpt, config);
                        initChart(_.chartObj, _.chartOpt);
                    })
                    break;
                case 'getMentionedMostServiceList':
                    var fnPromise = apiFn(_.platform, _.toppic, _.pnscope);
                    var fn = customWordCloudData;
                    // switch (scope.type) {
                    //     case 'hori':
                    //         fn = customHoriBarData;
                    //         break;
                    //     default:
                    //         break
                    // }
                    fn(fnPromise, _).then(function (config) {
                        _.chartOpt = angular.merge(_.chartOpt, config);
                        initChart(_.chartObj, _.chartOpt);
                    })
                    break;
                case 'getMentionedMostServiceDistribution':
                    var fnPromise = apiFn(_.platform, _.toppic, _.pnscope);
                    customServicesDistributionData(fnPromise, _).then(function (config) {
                        _.chartOpt = angular.merge(_.chartOpt, config);
                        initChart(_.chartObj, _.chartOpt);
                    })
                    break;
            }

            // watch window resize
            _.clientWidth = element[0].clientWidth;
            _.$watch("clientWidth", function (newV, oldV) {
                if (newV !== oldV) {
                    echarts.getInstanceByDom(echartDom.get(0)).resize();
                }
            })
            $(window).resize(function () {
                scope.$apply(function () {
                    _.clientWidth = element[0].clientWidth;
                });
            });
        },
        // controller: "@",
        // name: "controller"
    }
}

function initChart(echartObj, chartOpt, groupName) {
    // debugger;
    // console.log(echartObj)
    echartObj.setOption(chartOpt);
    if (groupName) {
        echartObj.group = groupName
    }
}

function customSpikesData(fnPromise, scope) {
    var simpleSeries = function (raw) {
        var seriesData = raw.map(function (item) {
            return item.dailyspikevol
        })
        return {
            xAxis: { data: scope.$root.dateList },
            series: [{
                name: 'Spikes',
                type: 'bar',
                data: seriesData
            }],
            title: {
                text: scope.title || ''
            }
        }
    }
    var barLineSeries = function (raw) {
        var barData = raw.map(function (item) {
            return item.dailyspikevol
        })
        var lineData = raw.map(function (item) {
            return item.dailytotalvol
        })
        return {
            xAxis: { data: scope.$root.dateList },
            grid: {
                width: '75%'
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Spike'
                }, {
                    type: 'value',
                    name: 'VoC'
                }
            ],
            series: [{
                name: 'Spikes',
                type: 'bar',
                data: barData
            }, {
                    name: 'VoC',
                    yAxisIndex: 1,
                    type: 'line',
                    data: lineData
                }],
            title: {
                text: scope.title || ''
            }
        }
    }
    var fn = simpleSeries;
    switch (scope.type) {
        case 'barLine':
            fn = barLineSeries;
            break;
        default:
            break
    }
    // console.log(scope.$root.dateList);
    return fnPromise.then(function (data) {
        return fn(data);
    })

}

function customDistributionData(fnPromise, scope) {
    return fnPromise.then(function (data) {
        return {
            series: [{
                data: [{
                    value: data.positivetotalvol,
                    name: 'POSI',
                    // itemStyle: {
                    //     normal: {
                    //         color: '#91c7ae'
                    //     }
                    // }
                }, {
                        value: data.negativetotalvol,
                        name: 'NEG'
                    }]
            }],
            title: {
                text: scope.title || ''
            }
        };
    })
}

function customWordCloudData(fnPromise, scope) {
    var pnscope = scope.pnscope;
    return fnPromise.then(function (data) {
        var seriesData = data.map(function (item) {
            var tmp = { name: item.attachedobject };
            switch (pnscope) {
                case 'posi':
                    var value = item.vocinfluence.positivetotalvol
                    break;
                case 'neg':
                    var value = item.vocinfluence.negativetotalvol
                    break;
                default:
                    var value = item.vocinfluence.voctotalvol
                    break;
            }
            tmp.value = value;
            return tmp;
        })
        return {
            series: {
                data: seriesData
            },
            title: {
                text: scope.title || ''
            }
        }
    })
}

function customServicesDistributionData(fnPromise, scope) {
    var propertySelect = scope.propertySelect;
    return fnPromise.then(function (data) {
        var seriesData = data.map(function (item) {
            var tmp = { name: item.attachedobject };
            switch (propertySelect) {
                case 'messages':
                    var value = item.vocinfluence.voctotalvol
                    break;
                case 'users':
                    var value = item.vocinfluence.uniqueusers
                    break;
                default:
                    var value = item.vocinfluence.voctotalvol
                    break;
            }
            tmp.value = value;
            return tmp;
        })
        // console.log(seriesData)
        return {
            series: [{
                data: seriesData
            }],
            title: {
                text: scope.title || ''
            }
        }
    })
}

function customHoriBarData(fnPromise, scope) {

}

function initAxisChartOpt(scope) {
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
        xAxis: {
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
    return opt;
}
function initHoriChartOpt(scope) {
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
        xAxis: {
            type: 'value',
            data: []
        },
        yAxis: [
            {
                type: 'category',
                data: []
            }
        ],
        series: []
    };
    return opt;
}
function initBarLineChartOpt(scope) {
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
        xAxis: {
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
}

function initPieChartOpt(scope) {
    var opt = {
        title: {
            textStyle: {
                fontSize: 13
            }
        },
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
    return opt;
}

function initCloudWordChartOpt(scope) {
    return {
        title: {
            textStyle: {
                fontSize: 20
            },
            x: 'center'
        },
        series: {
            type: 'wordCloud',
            gridSize: 1,
            sizeRange: [12, 35],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            left: 'center',
            top: 'bottom',
            width: '90%',
            height: '90%',
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: []
        }
    }
}

