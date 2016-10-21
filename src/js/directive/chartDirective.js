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

module.exports = /*@ngInject*/ function ($rootScope, $q, $location,$compile, utilitySrv) {
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
            var echartDom = $(element).find("div.echart");
            _.service = $rootScope.service;
            _.complete = false;
            _.query = _.query || {};
            _.compile = function(chart,dom){
                // console.log(_.$parent)
                var el = $compile(chart)(_.$parent);
                console.log(el);
                $(dom).append( el );
            }
            _.enlarge = function(){
                // console.log(element);
                $(element).parent().removeClass('two');
                $(element).addClass('large-chart');
                echartDom.addClass('large-chart');
                echarts.getInstanceByDom(echartDom.get(0)).resize();
            }
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
            _.chartObj = echarts.init(echartDom[0], 'macarons');
            _.chartObj.on('click', function (params) {
                if(params.value === 0) return;
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
                            // if (_.platform) {
                            // _.platform = _.platforms[0];
                            var fnPromise = apiFn(_.platform, _.query.topic, _.query.days);
                            customSpikesData(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            // } else {
                            //     _.platforms = _.$parent.enabledPlatforms;
                            //     // _.raw = [];
                            //     _.raw = {};
                            //     _.platforms.forEach(function (element) {
                            //         _.raw[element] = 0;
                            //     }, this);
                            //     console.log(_.raw);
                            //     var fnPromises = _.platforms.map(function (item) {
                            //         return apiFn(item, _.query.topic, _.query.days).then(function (data) {
                            //             var seriesData = data.map(function (raw) {
                            //                 // var tmp = { name: item };
                            //                 switch (_.pnscope) {
                            //                     case 'posi':
                            //                         var value = raw.dailyposiinfluencevol
                            //                         break;
                            //                     case 'neg':
                            //                         var value = raw.dailyneginfluencevol
                            //                         break;
                            //                     default:
                            //                         var value = raw.dailytotalinfluencevol
                            //                         break;
                            //                 }
                            //                 // tmp.value = value;
                            //                 // return tmp;
                            //                 return value;
                            //             })
                            //             _.raw[item] = (seriesData.reduce(function (previousValue, currentValue, currentIndex, array) {
                            //                 return previousValue + currentValue;
                            //             }))
                            //         })
                            //     })
                            //     // console.log(fnPromises);
                            //     $q.all(fnPromises).then(function () {
                            //         var config = customHoriBarData(_);
                            //         _.chartOpt = angular.merge(_.chartOpt, config);
                            //         initChart(_.chartObj, _.chartOpt);
                            //         afterInit($rootScope, _, _.chartObj);
                            //     })
                            // }
                            break;
                        case 'getInfluence':
                            // var fnPromise = apiFn(_.platform, _.query.topic);
                            // customInfluenceData(fnPromise, _).then(function (config) {
                            //     _.chartOpt = angular.merge(_.chartOpt, config);
                            //     initChart(_.chartObj, _.chartOpt);
                            //     afterInit($rootScope, _, _.chartObj);
                            // })
                            if (_.platform) {
                                // _.platform = _.platforms[0];
                                var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query.days);
                                // console.log(_);
                                customInfluenceData(fnPromise, _).then(function (config) {
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
                                // console.log(_.raw);
                                var fnPromises = _.platforms.map(function (item) {
                                    return apiFn(item, _.query.topic, _.pnscope, _.query.days).then(function (data) {
                                        var seriesData = data.map(function (raw) {
                                            // var tmp = { name: item };
                                            switch (_.pnscope) {
                                                case 'posi':
                                                    var value = raw.vocinfluence.positiveinfluencedvol
                                                    break;
                                                case 'neg':
                                                    var value = raw.vocinfluence.negativeinfluencedvol
                                                    break;
                                                case 'neu':
                                                    var value = raw.vocinfluence.neutralinfluencedvol
                                                    break;
                                                case 'undif':
                                                    var value = raw.vocinfluence.undefinedinfluencedvol
                                                    break;
                                                default:
                                                    var value = raw.vocinfluence.vocinfluencedvol
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
                            var fn = customServicesDistributionData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                console.log(_.chartOpt)
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope);
                            customServicesDistributionData(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                console.log(_.chartOpt);
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
                        // console.log(raw);
                        config = {
                            series: [{
                                data: [
                                    {
                                        value: raw.vocpositivecount,
                                        name: 'POS',
                                        // itemStyle: {
                                        //     normal: {
                                        //         color: '#91c7ae'
                                        //     }
                                        // }
                                    },
                                    {
                                        value: raw.vocneutralcount,
                                        name: 'NEU'
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
                            switch (_.pnscope) {
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

function customInfluenceData(fnPromise, scope) {
    var influenceSeries = function (raw) {
        var influenceData = raw.map(function (item) {
            return item.vocinfluence.voctotalvol
        })
        var influencePOSIData = raw.map(function (item) {
            return item.vocinfluence.positiveinfluencedvol
        })
        var influenceNEGData = raw.map(function (item) {
            return item.vocinfluence.negativeinfluencedvol
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
    var fn = influenceSeries;
    // switch (scope.type) {
    //     case 'influence':
    //         fn = influenceSeries;
    //         break;
    //     default:
    //         break;
    // }
    // console.log(scope.$root.dateList);
    return fnPromise.then(function (data) {
        return fn(data);
    })
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
                data: [
                    {
                        value: data.positivetotalvol,
                        name: 'POS',
                        // itemStyle: {
                        //     normal: {
                        //         color: '#91c7ae'
                        //     }
                        // }
                    },
                    {
                        value: data.neutraltotalvol,
                        name: 'NEU'
                    },
                    {
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
        var legendData = [];
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
            // legendData.push(item.attachedobject)
            return tmp;
        })
        // console.log(seriesData)
        return {
            series: [{
                data: seriesData
            }],
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data:legendData
            // },
            toolbox:{
                feature: {
                    myTool1: {
                        show: true,
                        title: '自定义扩展方法1',
                        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: function (){
                            alert('myToolHandler1')
                            scope.enlarge()
                            // var chart = '<ng-echart title="Mentioned (Messages Vol) Azure Services" type="pie" platform="'+scope.platform+'" query=query api-fn="getMentionedMostServiceDistribution" property-select="messages" location="home" sub-fn="getVoCDetailsByServiceName"></ng-echart>';
                            // // scope.compile(chart);
                            // var dom = "<div class='ui fullscreen modal'>"+chart+"</div>";
                            // scope.compile(chart,dom);
                            // $(dom).modal('show')

                        }
                    }
                },
                show:true
            },
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
                // saveAsImage: {
                //     show: true,
                //     title: "Save as Image"
                // }
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
