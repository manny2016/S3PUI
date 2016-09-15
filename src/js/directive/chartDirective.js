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

module.exports = function ($rootScope, $q, $location, rawdataSrv, testSrv) {
    return {
        restrict: 'E',
        templateUrl: 'public/template/chart.html',
        replace: true,
        scope: {
            // config: "=",
            title: "@",
            type: "@",
            platform: "@",
            //topic: "@",
            pnscope: "@",
            propertySelect: "@",
            days: "@",
            apiFn: "@",
            group: "@",
            query: "=",
            noPop: "@"
        },
        link: function (scope, element, attrs) {
            var service = testSrv;
            var _ = scope;
            _.complete = false;
            _.query = _.query || {};
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
            _.chartObj.on('click', function (params) {
                if (attrs.noPop === undefined) {
                    $rootScope.test();
                } else if (attrs.redirect) {
                    var path = '/';
                    switch (params.name) {
                        case 'twitter':
                            path = '/social';
                            break;
                        case 'so':
                            path = '/#';
                            // path = '/stackexchange';
                            break;
                        case 'sf':
                            path = '/#';
                            // path = '/stackexchange';
                            break;
                        case 'su':
                            path = '/#';
                            // path = '/stackexchange';
                            break;
                        case 'msdn':
                            path = '/#';
                            // path = '/msdn';
                            break;
                        case 'tn':
                            path = '/#';
                            // path = '/msdn';
                            break;
                    }
                    scope.$apply(function () {
                        $location.path(path);
                    });
                }
            });
            _.getData = function (location) {
                console.log(attrs.location, location)
                if (attrs.location === location) {
                    _.complete = false;
                    var apiFn = service[_.apiFn];
                    switch (_.apiFn) {
                        case 'getSpikes':
                            _.platforms = _.platform.split(",");
                            if (_.platforms.length == 1) {
                                var fnPromise = apiFn(_.platform, _.query.topic, _.query.days);
                                customSpikesData(fnPromise, _).then(function (config) {
                                    _.chartOpt = angular.merge(_.chartOpt, config);
                                    initChart(_.chartObj, _.chartOpt, _.group);
                                    afterInit($rootScope, _, _.chartObj);
                                })
                            } else {
                                _.raw = [];
                                var fnPromises = _.platforms.map(function (item) {
                                    return apiFn(item, _.query.topic, _.query.days).then(function (data) {
                                        var seriesData = data.map(function (raw) {
                                            // var tmp = { name: item };
                                            switch (_.pnscope) {
                                                case 'posi':
                                                    var value = raw.dailyposiinfluencevol
                                                    break;
                                                case 'neg':
                                                    var value = raw.dailyneginfluencevol
                                                    break;
                                                default:
                                                    var value = raw.dailytotalinfluencevol
                                                    break;
                                            }
                                            // tmp.value = value;
                                            // return tmp;
                                            return value;
                                        })
                                        _.raw.push(seriesData.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return previousValue + currentValue;
                                        }))
                                    })
                                })
                                // console.log(fnPromises);
                                $q.all(fnPromises).then(function () {
                                    var config = customHoriBarData(_);
                                    _.chartOpt = angular.merge(_.chartOpt, config);
                                    initChart(_.chartObj, _.chartOpt);
                                    afterInit($rootScope, _, _.chartObj);
                                })
                            }

                            break;
                        case 'getDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic);
                            customDistributionData(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceList':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customWordCloudData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceListByUserVol':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customWordCloudData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            customServicesDistributionData(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                    }
                }
            }
            _.$on('start-get-data', function (event, arg) {
                _.getData(arg);
            });
            _.$on('fresh-most-mentioned', function (evt, arg) {
                if ((_.apiFn === 'getMentionedMostServiceList' || _.apiFn === 'getMentionedMostServiceListByUserVol') && attrs.location === 'home') {
                    var apiFn = service[_.apiFn];
                    if (arg.pnscope === _.pnscope) {
                        _.platform = arg.platform ? arg.platform : _.platform;
                        _.pnscope = arg.pnscope ? arg.pnscope : _.pnscope;
                        _.topic = arg.topic ? arg.topic : _.topic;
                        var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                        var fn = customWordCloudData;
                        // _.chartOpt = initCloudWordChartOpt(_);
                        fn(fnPromise, _).then(function (config) {
                            _.chartOpt = angular.merge(_.chartOpt, config);
                            // console.log(_.chartOpt)
                            _.chartObj.setOption(_.chartOpt)
                        })
                    }
                }
            });
            _.$on('set-sub-widows-charts-data', function (evt, arg) {
                if (attrs.location !== 'sub') return;
                console.log('got it')
                var config = {};
                switch (_.type) {
                    case 'pie':
                        var raw = arg.data;
                        config = {
                            series: [{
                                data: [{
                                    value: raw.positivetotalvol,
                                    name: 'POSI',
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: '#91c7ae'
                                    //     }
                                    // }
                                }, {
                                        value: raw.negativetotalvol,
                                        name: 'NEG'
                                    }]
                            }],
                            title: {
                                text: scope.title || ''
                            }
                        };
                        break;
                    case 'wordcloud':
                        var raw = arg.data.vocmentionedmost;
                        var seriesData = raw.map(function (item) {
                            var tmp = { name: item.attachedobject };
                            switch (arg.pnscope) {
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
                        });
                        config = {
                            series: {
                                data: seriesData
                            },
                            title: {
                                text: scope.title || ''
                            }
                        }
                        break;
                }
                _.chartOpt = angular.merge(_.chartOpt, config);
                initChart(_.chartObj, _.chartOpt);
                scope.complete = true;
            })
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
    }
}

function initChart(echartObj, chartOpt, groupName) {
    // debugger;
    // console.log(echartObj)
    //var echartsWidth = echartObj.getWidth();
    //var domWidth = echartObj.getDom().offsetWidth;
    //if (echartsWidth !== domWidth) {
    //    echartObj.resize()
    //}
    setTimeout(function () {
        echartObj.resize();
        echartObj.setOption(chartOpt);
        if (groupName) {
            echartObj.group = groupName
        }
    }, 100)

    // echartObj.hideLoading();

}

function afterInit(rootscope, scope, echartObj) {
    scope.complete = true;
    if (scope.apiFn !== 'getMentionedMostServiceList') {
        //console.log(scope);
        setTimeout(function () {
            echartObj.resize();
        }, 150)
    }
    //var echartsWidth = echartObj.getWidth();
    //var domWidth = echartObj.getDom().offsetWidth;
    //if (echartsWidth !== domWidth) {
    //    echartObj.resize()
    //}
    rootscope.$broadcast('data-got', echartObj);
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
                    name: 'Spike',
                    nameTextStyle: {
                        color: '#2ec7c9'
                    }
                }, {
                    type: 'value',
                    name: 'VoC',
                    nameTextStyle: {
                        color: '#baa7e0'
                    }
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
            break;
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

function customHoriBarData(scope) {
    return {
        yAxis: {
            data: scope.platforms
        },
        series: [{
            name: scope.pnscope + ' Vol',
            type: 'bar',
            data: scope.raw
        }],
        title: {
            text: scope.title || ''
        }
    };
}

function initAxisChartOpt(scope) {
    var opt = {
        title: {
            textStyle: {
                fontSize: 13
            }
        },
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
        title: {
            textStyle: {
                fontSize: 13
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            // width:'85%'
            left: '15%',
            right: '3%'
        },
        toolbox: {
            show: false,
            trigger: 'axis',
            feature: {
                saveAsImage: { show: true, title: "Save as Image" }
            }
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: []
    };
    return opt;
}
function initBarLineChartOpt(scope) {
    var opt = {
        title: {
            textStyle: {
                fontSize: 13
            }
        },
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
                fontSize: 13
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
            top: 'center',
            width: '90%',
            height: '80%',
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

