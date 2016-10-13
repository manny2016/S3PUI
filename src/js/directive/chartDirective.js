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

module.exports = /*@ngInject*/ function ($rootScope, $q, $location, utilitySrv) {
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
            subFn: '@',
            group: "@",
            query: "=",
            noPop: "@"
        },
        link: function (scope, element, attrs) {
            var _ = scope;
            _.service = $rootScope.service;
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
                    case 'hourly':
                        _.chartOpt = initHourlyChartOpt(_);
                        break;
                    default:
                        _.chartOpt = initAxisChartOpt(_);
                        break;
                }
            } ();
            var echartDom = $(element).find("div.echart");
            _.chartObj = echarts.init(echartDom[0], 'macarons');
            _.chartObj.on('click', function (params) {
                // console.log(params)
                if (attrs.noPop === undefined) {
                    // $rootScope.popSubWin();
                    // console.log(params)
                    // console.log(_)
                    // console.log(_.subFn);
                    switch (_.subFn) {
                        case 'getVoCDetailsByDate':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                date: Math.floor((function (d) { d.setDate(d.getDate()); return d.setHours(0, 0, 0, 0) })(new Date(params.name)) / 1000),
                                pnscope: _.pnscope
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getVoCDetailsByPN':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                pnscope: params.name.toLowerCase()
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getVoCDetailsByUser':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                user: params.name,
                                pnscope: _.pnscope
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getVoCDetailsByServiceName':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                service: params.name,
                                pnscope: _.pnscope
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getSubPageVoCDetails':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                date: Math.floor((function (d) { d.setDate(d.getDate()); return d.setHours(0, 0, 0, 0) })(new Date(params.name)) / 1000),
                                pnscope: _.pnscope
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getSubPageVoCDetailsbyKeywords':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                keywords: params.name,
                                pnscope: _.pnscope
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                    }
                } else if (attrs.redirect) {
                    var path = '/';
                    switch (params.name) {
                        case 'twitter':
                            path = '/social/' + params.name;
                            break;
                        case 'so':
                            path = '/thirdParty/' + params.name;
                            // path = '/stackexchange';
                            break;
                        case 'sf':
                            path = '/thirdParty/' + params.name;
                            // path = '/stackexchange';
                            break;
                        case 'su':
                            path = '/thirdParty/' + params.name;
                            // path = '/stackexchange';
                            break;
                        case 'msdn':
                            path = '/msPlatform/' + params.name;
                            // path = '/msdn';
                            break;
                        case 'tn':
                            path = '/msPlatform/' + params.name;
                            // path = '/msdn';
                            break;
                    }
                    scope.$apply(function () {
                        $location.path(path);
                    });
                }
            });
            _.getData = function (location) {
                // console.log(attrs.location, location)
                if (attrs.location === location) {
                    _.complete = false;
                    var apiFn = _.service[_.apiFn];
                    switch (_.apiFn) {
                        case 'getSpikes':
                            if (_.platform) {
                                // _.platform = _.platforms[0];
                                var fnPromise = apiFn(_.platform, _.query.topic, _.query.days);
                                customSpikesData(fnPromise, _).then(function (config) {
                                    _.chartOpt = angular.merge(_.chartOpt, config);
                                    initChart(_.chartObj, _.chartOpt, _.group);
                                    afterInit($rootScope, _, _.chartObj);
                                })
                            } else {
                                _.platforms = _.$parent.enabledPlatforms;
                                // _.raw = [];
                                _.raw = {};
                                _.platforms.forEach(function (element) {
                                    _.raw[element] = 0;
                                }, this);
                                console.log(_.raw);
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
                                        _.raw[item] = (seriesData.reduce(function (previousValue, currentValue, currentIndex, array) {
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
                        case 'getKeywordsMentionedMostMapping':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customWordCloudData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getUserVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customHourlyData;
                            fn(fnPromise, 'uniqueusers', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMessageVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customHourlyData,
                                key = '';
                            switch (_.pnscope) {
                                case 'posi':
                                    key = 'voctotalvol';
                                    break;
                                case 'neg':
                                    key = 'voctotalvol';
                                    break;
                                default:
                                    key = 'voctotalvol';
                                    break;
                            }
                            fn(fnPromise, key, utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getInfluenceVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customHourlyData;
                            fn(fnPromise, 'vocinfluencedvol', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getUserRegionVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            var fn = customHourlyData;
                            fn(fnPromise, 'uniqueuserregion', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                    }
                }
            }
            _.$on('start-get-data', function (event, arg) {
                _.complete = false;
                _.getData(arg);
            });
            _.$on('fresh-most-mentioned', function (evt, arg) {
                if ((_.apiFn === 'getMentionedMostServiceList' || _.apiFn === 'getMentionedMostServiceListByUserVol') && attrs.location === 'home') {
                    var apiFn = _.service[_.apiFn];
                    if (arg.pnscope === _.pnscope) {
                        _.platform = arg.platform ? arg.platform : _.platform;
                        _.pnscope = arg.pnscope ? arg.pnscope : _.pnscope;
                        _.topic = arg.topic ? arg.topic : _.topic;
                        var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                        var fn = customWordCloudData;
                        _.chartOpt = initCloudWordChartOpt(_);
                        fn(fnPromise, _).then(function (config) {
                            _.chartOpt = angular.merge(_.chartOpt, config);
                            // console.log(_.chartOpt)
                            // initChart(_.chartObj, _.chartOpt);
                            _.chartObj.setOption(_.chartOpt)
                        })
                    }
                }
            });
            _.$on('set-sub-widows-charts-data', function (evt, arg) {
                if (attrs.location !== 'sub') return;
                var config = {};
                switch (_.type) {
                    case 'pie':
                        var raw = arg.data;
                        config = {
                            series: [{
                                data: [{
                                    value: raw.vocpositivecount,
                                    name: 'POSI',
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: '#91c7ae'
                                    //     }
                                    // }
                                }, {
                                        value: raw.vocnegativecount,
                                        name: 'NEG'
                                    }]
                            }],
                            title: {
                                text: _.title || ''
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
                _.complete = true;
            })
            // watch window resize
            _.clientWidth = element[0].clientWidth;
            _.$watch("clientWidth", function (newV, oldV) {
                if (newV !== oldV) {
                    echarts.getInstanceByDom(echartDom.get(0)).resize();
                }
            })
            $(window).resize(function () {
                _.$apply(function () {
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
            console.log(groupName)
            echartObj.group = groupName
        }
    }, 100)

    // echartObj.hideLoading();

}

function afterInit(rootscope, scope, echartObj) {
    scope.complete = true;
    if (scope.apiFn !== 'getMentionedMostServiceList' && scope.apiFn !== 'getKeywordsMentionedMostMapping') {
        //console.log(scope);
        setTimeout(function () {
            echartObj.resize();
        }, 150)
    }
    if (scope.group) {
        echarts.connect(scope.group);
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
                type: 'line',
                data: barData
            }, {
                    name: 'VoC',
                    yAxisIndex: 1,
                    type: 'bar',
                    data: lineData
                }],
            title: {
                text: scope.title || ''
            }
        }
    }
    var influenceSeries = function (raw) {
        var influenceData = raw.map(function (item) {
            return item.dailytotalinfluencevol
        })
        var influencePOSIData = raw.map(function (item) {
            return item.dailyposiinfluencevol
        })
        var influenceNEGData = raw.map(function (item) {
            return item.dailyneginfluencevol
        })
        var seriesData = [];
        switch (scope.pnscope) {
            case 'posi':
                seriesData = influencePOSIData;
                break;
            case 'neg':
                seriesData = influenceNEGData;
                break;
            default:
                seriesData = influenceData;
                break;
        }
        return {
            xAxis: { data: scope.$root.dateList },
            series: [{
                name: 'Influence Vol',
                type: 'line',
                data: seriesData
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
        case 'influence':
            fn = influenceSeries;
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
            data: Object.keys(scope.raw)
        },
        series: [{
            name: scope.pnscope + ' Vol',
            type: 'bar',
            data: Object.keys(scope.raw).map(function (key) {
                return scope.raw[key];
            })
        }],
        title: {
            text: scope.title || ''
        }
    };
}

function customHourlyData(fnPromise, key, utility, scope) {
    var seriesData = [], xAxisDate = [];
    return fnPromise.then(function (data) {
        data.map(function (item) {
            var tmp = {};
            xAxisDate.push(utility.timeToString(item.attachedobject.timeslot));
            if (item.attachedobject.isspike) {
                var entity = {
                    value: item.vocinfluence[key],
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
                    value: item.vocinfluence[key],
                    symbolSize: 4
                };
            }
            // console.log(entity)
            seriesData.push(entity);
        })
        // console.log(seriesData)
        return {
            series: [{
                name: 'Vol',
                type: 'line',
                showAllSymbol: true,
                data: seriesData
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    onZero: false
                },
                data: xAxisDate
            },
            title: {
                text: scope.title || ''
            }
        }
    })
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
                label: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        },
                        formatter: '{b}\n ({d}%)'
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
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
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

function initHourlyChartOpt(scope) {
    var opt = {
        title: {
            textStyle: {
                fontSize: 13
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        toolbox: {
            show: false,
            trigger: 'axis',
            feature: {
                saveAsImage: { show: true, title: "Save as Image" }
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
            data: []
        },
        yAxis: {},
        series: []
    };
    return opt;
}
