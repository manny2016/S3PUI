/*
 @parameters:
    platform string
        all,twitter,so,sf,su,msdn,tn
    topic string
        all,azure,...
    pnscope string
        all,posi,neg
*/

module.exports = /*@ngInject*/ function ($rootScope, $filter, $q, $location, $compile, $timeout, utilitySrv) {
    return {
        restrict: 'E',
        templateUrl: 'public/template/chart.html?time=' + new Date().getTime(),
        replace: true,
        scope: {
            // config: "=",
            caption: "@",
            type: "@",
            platform: "@",
            //topic: "@",
            pnscope: "@",
            propertySelect: "@",
            apiFn: "@",
            subFn: '@',
            group: "@",
            query: "=",
            noPop: "@",
            association: "@",
            swithTool: "@",
            noSwap: "@",
            stack: '@',
            info: '@'
        },
        link: function (scope, element, attrs) {
            var _ = scope;
            var echartDom = $(element).find("div.echart");
            _.service = $rootScope.service;
            _.complete = false;
            _.query = _.query || {};
            _.thousandsuffix = $filter('thousandsuffix');
            _.compile = function (chart, dom) {
                var el = $compile(chart)(_.$parent);
                $(dom).append(el);
            }
            _.swithside = function () {
                $(element).parent().parent().parent().shape('flip up')
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
                    case 'world':
                        _.chartOpt = initWorldChartOpt(_);
                        break;
                    default:
                        _.chartOpt = initAxisChartOpt(_);
                        break;
                }
            }();
            _.chartObj = echarts.init(echartDom[0], 'macarons');
            _.chartObj.on('click', function (params) {
                if (params.value === 0) return;
                if (attrs.noPop === undefined) {
                    switch (_.subFn) {
                        case 'getVoCDetailsByDate':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                pnscope: _.pnscope,
                                date: Math.floor(moment.utc(params.name, 'L') / 1000),
                                granularity: _.query.granularity
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getVoCDetailsByPN':
                            var pnscope = params.name.toLowerCase();
                            if (pnscope == 'pos') pnscope = 'posi';
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                pnscope: pnscope,
                                granularity: _.query.granularity,
                                start: _.query.start,
                                end: _.query.end
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getVoCDetailsByServiceName':
                            var pnscope = _.pnscope;
                            //// params.seriesName: Dislike, Like
                            //// params.seriesIndex:      1, 0
                            if (params.seriesName === 'Dislike') {
                                pnscope = 'neg';
                            } else if (params.seriesName === 'Like') {
                                pnscope = 'posi';
                            }
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                service: params.name,
                                pnscope: pnscope,
                                granularity: _.query.granularity,
                                start: _.query.start,
                                end: _.query.end
                            }
                            if (params.name === 'Others') {
                                _.swithside();
                            } else {
                                $rootScope.popSubWin({
                                    fn: _.subFn,
                                    param: param
                                });
                            }
                            break;
                        case 'getVoCDetailsByUser':
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                user: params.name,
                                pnscope: _.pnscope,
                                granularity: _.query.granularity,
                                start: _.query.start,
                                end: _.query.end
                            }
                            $rootScope.popSubWin({
                                fn: _.subFn,
                                param: param
                            });
                            break;
                        case 'getSubPageVoCDetails':
                            var date = Math.floor((new Date(params.name)).valueOf() / 1000);
                            if (_.query.granularity != 2) {
                                date -= (new Date()).getTimezoneOffset() * 60;
                            }
                            var param = {
                                platform: _.platform,
                                topic: _.query.topic,
                                pnscope: _.pnscope,
                                date: date,
                                granularity: _.query.granularity,
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
                                pnscope: _.pnscope,
                                granularity: _.query.granularity,
                                start: _.query.start,
                                end: _.query.end
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
                if (attrs.location === location) {
                    _.complete = false;
                    var apiFn = _.service[_.apiFn];
                    switch (_.apiFn) {
                        case 'getSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.query);
                            customSpikesData(fnPromise, _, utilitySrv).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getInfluence':
                            if (_.platform) {
                                var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                                customInfluenceData(fnPromise, _, utilitySrv).then(function (config) {
                                    _.chartOpt = angular.extend(_.chartOpt, config);
                                    initChart(_.chartObj, _.chartOpt, _.group);
                                    afterInit($rootScope, _, _.chartObj);
                                })
                            } else {
                                _.platforms = _.$parent.enabledPlatforms;
                                _.raw = {};
                                _.platforms.forEach(function (element) {
                                    _.raw[element] = 0;
                                }, this);
                                var fnPromises = _.platforms.map(function (item) {
                                    return apiFn(item, _.query.topic, _.pnscope, {
                                        granularity: 3,
                                        start: _.query.start,
                                        end: _.query.end
                                    }).then(function (data) {
                                        var seriesData = data.map(function (raw) {
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
                                            return value;
                                        })
                                        _.raw[item] = (seriesData.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return previousValue + currentValue;
                                        }, 0))
                                        _.hasData = true;
                                    })
                                })
                                $q.all(fnPromises).then(function () {
                                    var config = customHoriBarData(_);
                                    _.chartOpt = angular.extend(_.chartOpt, config);
                                    initChart(_.chartObj, _.chartOpt);
                                    afterInit($rootScope, _, _.chartObj);
                                })
                            }
                            break;
                        case 'getDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.query);
                            customDistributionData(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceList':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            var fn = customWordCloudData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                                alert("ok");
                            })
                            break;
                        case 'getMentionedMostServiceListByUserVol':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            _.order = $filter('orderBy');
                            var fn = customServicesDistributionData;
                            switch (_.type) {
                                case 'pie':
                                    fn = customServicesDistributionData;
                                    break;
                                case 'wordcloud':
                                    fn = customWordCloudData;
                                    break;
                            }
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMentionedMostServiceDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            _.order = $filter('orderBy');
                            var fn = customServicesDistributionData;
                            if (_.type === 'hori') {
                                fn = barNegativeData;
                            }
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getKeywordsMentionedMostMapping':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            var fn = customWordCloudData;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.merge(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getUserVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            customHourlyData(fnPromise, 'uniqueusers', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getMessageVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            key = '';
                            switch (_.pnscope) {
                                case 'posi':
                                    key = 'positivetotalvol';
                                    break;
                                case 'neg':
                                    key = 'negativetotalvol';
                                    break;
                                default:
                                    key = 'voctotalvol';
                                    break;
                            }
                            customHourlyData(fnPromise, key, utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getStackMessageVol':
                            var fnPromise = _.service['getMessageVolSpikes'](_.platform, _.query.topic, _.pnscope, _.query);
                            // _.hasData = true;
                            stackAxisData(fnPromise, utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getInfluenceVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            customHourlyData(fnPromise, 'vocinfluencedvol', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getUserRegionVolSpikes':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            customHourlyData(fnPromise, 'uniqueuserregion', utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt, _.group);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getRegionDistribution':
                            var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                            // var fnPromise = $q.resolve(true);
                            if (_.type === 'world') {
                                var fn = customWorldData;
                            } else {
                                var fn = customRegionData;
                            }
                            _.hasData = true;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'getVoCDetailsByServiceName1':
                            var fnPromise = $q.resolve(true);
                            var fn = barNegativeData;
                            _.hasData = true;
                            fn(fnPromise, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
                                afterInit($rootScope, _, _.chartObj);
                            })
                            break;
                        case 'sentimentconversion':
                            var fnPromise = _.service['getSentimentTrend'](_.platform, _.query.topic, _.pnscope, _.query);
                            sentimentconversionData(fnPromise, utilitySrv, _).then(function (config) {
                                _.chartOpt = angular.extend(_.chartOpt, config);
                                initChart(_.chartObj, _.chartOpt);
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
                        var fnPromise = apiFn(_.platform, _.query.topic, _.pnscope, _.query);
                        var fn = customWordCloudData;
                        _.chartOpt = initCloudWordChartOpt(_);
                        fn(fnPromise, _).then(function (config) {
                            _.chartOpt = angular.merge(_.chartOpt, config);
                            // initChart(_.chartObj, _.chartOpt);
                            // debugger;
                            var clientWidth = element.parents('.sides').width();
                            element.find('.echart').width(clientWidth);
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
                        _.validData(raw);
                        config = {
                            series: [{
                                data: [{
                                    value: raw.vocpositivecount,
                                    name: 'POS',
                                    // itemStyle: {
                                    //     normal: {
                                    //         color: '#91c7ae'
                                    //     }
                                    // }
                                }, {
                                    value: raw.vocneutralcount,
                                    name: 'NEU'
                                }, {
                                    value: raw.vocnegativecount,
                                    name: 'NEG'
                                }]
                            }]
                        };
                        _.chartOpt = angular.merge(_.chartOpt, config);
                        break;
                    case 'wordcloud':
                        var raw = arg.data.vocmentionedmost;
                        var seriesData = [];
                        for (var i = 0; i < raw.length; i++) {
                            if (raw[i].attachedobject) {
                                switch (_.pnscope) {
                                    case 'posi':
                                        var value = raw[i].vocinfluence.positivetotalvol
                                        break;
                                    case 'neg':
                                        var value = raw[i].vocinfluence.negativetotalvol
                                        break;
                                    default:
                                        var value = raw[i].vocinfluence.voctotalvol
                                        break;
                                }
                                if (value) {
                                    var tmp = {
                                        name: raw[i].attachedobject
                                    };
                                    tmp.value = value;
                                    seriesData.push(tmp);
                                }
                            }
                        }
                        // var seriesData = raw.map(function (item) {
                        //     switch (_.pnscope) {
                        //         case 'posi':
                        //             var value = item.vocinfluence.positivetotalvol
                        //             break;
                        //         case 'neg':
                        //             var value = item.vocinfluence.negativetotalvol
                        //             break;
                        //         default:
                        //             var value = item.vocinfluence.voctotalvol
                        //             break;
                        //     }
                        //     if (value) {
                        //         var tmp = {
                        //             name: item.attachedobject
                        //         };
                        //         tmp.value = value;
                        //         return tmp;
                        //     }
                        // });
                        _.validData(seriesData);
                        // config = {
                        //     series: {
                        //         data: seriesData
                        //     },
                        // }
                        _.chartOpt.series.data = seriesData;
                        break;
                }
                initChart(_.chartObj, _.chartOpt);
                // _.chartObj.resize();
                _.complete = true;
            })
            // watch window resize
            _.validData = function (data) {
                $timeout(function () {
                    _.hasData = !isEmpty(data)
                }, 0)
            }

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

            $(element).find('.popup').popup();
        },
    }
}

function initChart(echartObj, chartOpt, groupName) {
    // debugger;
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
    if (scope.apiFn !== 'getMentionedMostServiceList' && scope.apiFn !== 'getKeywordsMentionedMostMapping') {
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

function customInfluenceData(fnPromise, scope, utilitySrv) {
    var influenceSeries = function (raw) {
        var influenceData = raw.map(function (item) {
            return item.vocinfluence.vocinfluencedvol
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
        var xaxis = [];
        return {
            yAxis: {
                axisLabel: {
                    // rotate:45,
                    formatter: function (value) {
                        return scope.thousandsuffix(value, 1)
                    }
                }
            },
            xAxis: {
                data: utilitySrv.getTimeRange(scope.query.start, scope.query.end).map(function (dt) {
                    return moment(dt).utc().format('L');
                })
            },
            series: [{
                name: 'Influence Vol',
                type: 'line',
                data: seriesData
            }]
        }
    }
    return fnPromise.then(function (data) {
        scope.validData(data);
        return influenceSeries(data);
    })
}

function customSpikesData(fnPromise, scope, utilitySrv) {
    var xAxis = {
        data: utilitySrv.getTimeRange(scope.query.start, scope.query.end).map(function (dt) {
            return moment(dt).utc().format('L');
        })
    };

    var seriesVolume = function (source) {
        var volumes = source.map(function (entity) {
            return entity.dailytotalvol;
        });
        return {
            xAxis: xAxis,
            series: [{
                name: 'VoC',
                type: 'bar',
                data: volumes
            }]
        }
    }
    var seriesSpike = function (source) {
        var spikes = source.map(function (entity) {
            return entity.dailyspikevol
        });
        return {
            xAxis: xAxis,
            series: [{
                name: 'Spikes',
                type: 'bar',
                data: spikes
            }]
        }
    }
    var seriesVolumeSpike = function (source) {
        var volumes = source.map(function (entity) {
            return entity.dailytotalvol
        });
        var spikes = source.map(function (entity) {
            return entity.dailyspikevol
        });

        return {
            xAxis: xAxis,
            yAxis: [{
                name: 'VoC',
                type: 'value',
                nameTextStyle: {
                    color: '#2EC7C9'
                }
            }],
            tooltip: {
                formatter: function (params, ticket, callback) {
                    var value = spikes[params.dataIndex];
                    return params.name
                        + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2EC7C9"></span>VoC: ' + params.value
                        + (value > 0
                            ? '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#F2711C"></span>Spike'
                            : (value < 0
                                ? '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#42453B"></span>Dip'
                                : ''));
                }
            },
            series: [{
                name: 'VoC',
                type: 'bar',
                data: volumes,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var value = spikes[params.dataIndex];
                            if (value > 0) {
                                return '#F2711C';
                            } else if (value < 0) {
                                return '#42453B';
                            } else {
                                return '#2EC7C9';
                            }
                        }
                    }
                }
            }]
        };
    }
    return fnPromise.then(function (data) {
        scope.validData(data);
        switch (scope.type) {
            case 'volume':
                return seriesVolume(data);
            case 'spike':
                return seriesSpike(data);
            default:
                return seriesVolumeSpike(data);
        }
    });
}

function customDistributionData(fnPromise, scope) {
    return fnPromise.then(function (data) {
        // debugger;
        scope.validData(data);
        return {
            series: [{
                data: [{
                    value: data.positivetotalvol,
                    name: 'POS',
                    // itemStyle: {
                    //     normal: {
                    //         color: '#91c7ae'
                    //     }
                    // }
                }, {
                    value: data.neutraltotalvol,
                    name: 'NEU'
                }, {
                    value: data.negativetotalvol,
                    name: 'NEG'
                }]
            }]
        };
    })
}

function customWordCloudData(fnPromise, scope) {
    var pnscope = scope.pnscope;
    return fnPromise.then(function (data) {
        scope.validData(data);
        var seriesData = data.map(function (item) {
            // var tmp = {
            //     name: item.attachedobject
            // };
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
            if (!value) return false;
            var tmp = {
                name: item.attachedobject
            };
            tmp.value = value;
            return tmp;
        })
        return {
            series: {
                data: seriesData
            }
        }
    })
}

function customServicesDistributionData(fnPromise, scope) {
    var propertySelect = scope.propertySelect;
    return fnPromise.then(function (data) {
        scope.validData(data);
        var legendData = [];
        var seriesData = data.map(function (item) {
            var tmp = {
                name: item.attachedobject,
                url: item.url
            };
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
        seriesData = scope.order(seriesData, '-value')
        // debugger;
        // if (seriesData.length > 11) {
        var tops = seriesData.slice(0, 10);
        var rest = seriesData.slice(10);
        var sum = 0,
            total = 0;
        for (var i = 0; i < tops.length; i++) {
            total += tops[i]['value'];
        }
        for (var i = 0; i < rest.length; i++) {
            sum += rest[i]['value'];
        }
        total += sum;
        scope.$root.$broadcast('set-mentioned-table-data', {
            data: seriesData,
            total: total,
            association: scope.association
        });
        if (seriesData.length > 11) {
            var other = {
                name: 'Others',
                value: sum
            }
            tops.push(other);
        }
        seriesData = tops;

        var toolbox = {
            feature: {
                myTool1: {
                    show: true, //true
                    title: 'Switch to Details List',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        scope.swithside()
                    }
                }
            },
            show: true
        };
        return {
            series: [{
                // avoidLabelOverlap: false,
                // label: {
                //     normal: {
                //         position: 'inside'
                //     }
                // },
                data: seriesData
            }],
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data:legendData
            // },
            toolbox: toolbox
        }
    })
}

function customHoriBarData(scope) {
    return {
        yAxis: {
            axisLabel: {
                interval: 0,
                // rotate:45,
                inside: true
            },
            z: 10,
            data: Object.keys(scope.raw)
        },
        series: [{
            name: scope.pnscope + ' Vol',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#ffb980'
                }
            },
            data: Object.keys(scope.raw).map(function (key) {
                return scope.raw[key];
            })
        }]
    };
}

function fixUserRegion(region) {
    var fixed = region || "United States of America";
    if (fixed === "United States") { fixed = "United States of America"; }
    return fixed;
}
function customWorldData(fnPromise, scope) {
    var propertySelect = scope.propertySelect;
    return fnPromise.then(function (data) {
        scope.validData(data);
        var seriesData = data.reduce(function (agg, item) {
            var region = fixUserRegion(item.name);
            var swap = agg.find(function (e) {
                return e.name === region;
            });

            var value = 0;
            switch (propertySelect) {
                case 'positive':
                    value = item.positivetotalvol
                    break;
                case 'negative':
                    value = item.negativetotalvol
                    break;
                case 'users':
                    value = item.uniqueusers
                    break;
            }

            if (swap) {
                swap.value += value;
            } else {
                agg.push({
                    name: region,
                    url: item.url,
                    value: value
                });
            }

            return agg;
        }, []);
        scope.$root.$broadcast('set-region-table-data', {
            data: seriesData,
            association: scope.association
        });
        return {
            toolbox: {
                feature: {
                    myTool1: {
                        show: true, //true
                        title: 'Switch to Others List',
                        icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: function () {
                            scope.swithside()
                        }
                    }
                },
                show: (scope.noSwap !== 'true')
            },
            series: [{
                name: scope.caption,
                type: 'map',
                mapType: 'world',
                roam: true,
                itemStyle: {
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: seriesData
            }]
        }
    });
}

function customRegionData(fnPromise, scope) {
    var xData = [];
    return fnPromise.then(function (data) {
        scope.validData(data);
        var seriesData = data.reduce(function (agg, item) {
            var region = fixUserRegion(item.name);
            var index = xData.indexOf(region);
            if (index >= 0) {
                agg[index] += item.uniqueusers;
            } else {
                xData.push(region);
                agg.push(item.uniqueusers);
            }
        }, []);

        return {
            dataZoom: [{
                show: true,
                realtime: true,
                start: 0,
                end: 100
            }],
            xAxis: {
                data: xData
            },
            series: [{
                name: 'Volume',
                type: 'bar',
                data: seriesData
            }]
        }
    });
}

function stackAxisData(fnPromise, utility, scope) {
    var seriesData = {
        'undif': [],
        'posi': [],
        'neg': [],
        'neu': []
    },
        xAxisDate = [];
    return fnPromise.then(function (data) {
        scope.validData(data);
        data.map(function (item) {
            var tmp = {};
            if (scope.query.granularity === 2) {
                xAxisDate.push((new Date(item.attachedobject.timeslot * 1000)).toLocaleString());
            } else {
                xAxisDate.push((new Date(item.attachedobject.timeslot * 1000)).toLocaleDateString());
            }
            var entity = {
                value: item.vocinfluence['undefinedtotalvol'],
                symbolSize: 4
            };
            seriesData.undif.push(entity);
            var entity = {
                value: item.vocinfluence['positivetotalvol'],
                symbolSize: 4
            };
            seriesData.posi.push(entity);
            var entity = {
                value: item.vocinfluence['negativetotalvol'],
                symbolSize: 4
            };
            seriesData.neg.push(entity);
            var entity = {
                value: item.vocinfluence['neutraltotalvol'],
                symbolSize: 4
            };
            seriesData.neu.push(entity);
        })
        return {
            legend: {
                data: ['Undefined', 'Positive', 'Negative', 'Neutral']
            },
            series: [{
                name: 'Undefined',
                type: 'line',
                //stack: 'total',
                showAllSymbol: true,
                areaStyle: {
                    normal: {}
                },
                data: seriesData.undif
            }, {
                name: 'Positive',
                type: 'line',
                //stack: 'total',
                showAllSymbol: true,
                areaStyle: {
                    normal: {}
                },
                data: seriesData.posi
            }, {
                name: 'Negative',
                type: 'line',
                //stack: 'total',
                showAllSymbol: true,
                areaStyle: {
                    normal: {}
                },
                data: seriesData.neg
            }, {
                name: 'Neutral',
                type: 'line',
                //stack: 'total',
                showAllSymbol: true,
                areaStyle: {
                    normal: {}
                },
                data: seriesData.neu
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    onZero: false
                },
                data: xAxisDate
            }
        }
    })
}

function barNegativeData(fnPromise, scope) {
    return fnPromise.then(function (data) {
        scope.validData(data);
        var usedData = scope.order(data, '-(vocinfluence.positivetotalvol+vocinfluence.negativetotalvol)').splice(0, 10);
        var likeData = [],
            dislikeData = [],
            yAxisData = [];
        usedData.map(function (item) {
            yAxisData.push(item.attachedobject)
            likeData.push(item.vocinfluence.positivetotalvol)
            dislikeData.push(-1 * item.vocinfluence.negativetotalvol)
        });
        return {
            xAxis: [{
                type: 'value'
            }],
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                // nameLocation:'start',
                axisLabel: {
                    interval: 0
                },
                data: yAxisData,
                z: 10
            },
            grid: {
                top: 30,
                left: 20,
                right: 20,
                bottom: 0,
                containLabel: true
            },
            series: [{
                name: 'Like',
                type: 'bar',
                stack: 'volume',
                areaStyle: {
                    normal: {}
                },
                data: likeData
            }, {
                name: 'Dislike',
                type: 'bar',
                stack: 'volume',
                itemStyle: {
                    normal: {
                        color: '#ffb980'
                    }
                },
                areaStyle: {
                    normal: {
                        show: true,
                        position: 'left'
                    }
                },
                data: dislikeData
            }],
        }
    });
}

function sentimentconversionData(fnPromise, utility, scope) {
    var seriesData = {
        totalVol: [],
        initPostive: [],
        afterSptPostive: [],
        initNegative: [],
        afterSptNegative: [],
    },
        xAxisDate = [];
    return fnPromise.then(function (data) {
        scope.validData(data);
        data.map(function (item) {
            if (scope.query.granularity === 2) {
                xAxisDate.push((new Date(item.SclingTime * 1000)).toLocaleString());
            } else {
                xAxisDate.push((new Date(item.SclingTime * 1000)).toLocaleDateString());
            }
            seriesData.totalVol.push(item.TotalVolume);
            seriesData.initPostive.push(item.InitialPostiveVolume);
            seriesData.afterSptPostive.push(item.AfterSupportPostiveVolume);
            seriesData.initNegative.push(item.InitialNegtiveVolume);
            seriesData.afterSptNegative.push(item.AfterSupportNegtiveVolume);
        })
        return {
            yAxis: [{
                type: 'value'
            }],
            xAxis: [{
                type: 'category',
                data: xAxisDate
            }],
            legend: {
                data: ['Init Negative Volume', 'After Support Negative Volume'],
                show: true
            },
            series: [{
                name: 'Init Negative Volume',
                type: 'line',
                areaStyle: {
                    normal: {}
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                data: seriesData.initNegative
            }, {
                name: 'After Support Negative Volume',
                type: 'line',
                areaStyle: {
                    normal: {}
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                data: seriesData.afterSptNegative
            }],
        }
    });
}

function customHourlyData(fnPromise, key, utility, scope) {
    var seriesData = [],
        xAxisDate = [];
    return fnPromise.then(function (data) {
        scope.validData(data);
        data.map(function (item) {
            var tmp = {};
            if (scope.query.granularity === 2) {
                xAxisDate.push((new Date(item.attachedobject.timeslot * 1000)).toLocaleString());
            } else {
                xAxisDate.push((new Date(item.attachedobject.timeslot * 1000)).toLocaleDateString());
            }
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
            seriesData.push(entity);
        })
        return {
            series: [{
                name: 'Vol',
                type: 'line',
                showAllSymbol: true,
                data: seriesData,
                label: {
                    normal: {
                        formatter: function (params) {
                            return scope.thousandsuffix(params.value)
                        }
                    }
                }
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    onZero: false
                },
                data: xAxisDate
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
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
            }
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }],
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
            left: '5%',
            // right: '3%'
        },
        toolbox: {
            show: false,
            trigger: 'axis',
            feature: {
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
            }
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                // rotate:45,
                formatter: function (value) {
                    return scope.thousandsuffix(value, 1)
                }
            }
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
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
            }
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: [{
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        }],
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
        grid: {
            bottom: 0
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
            feature: {
                myTool1: {
                    show: true, //true
                    title: 'Switch to Others List',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function () {
                        scope.swithside()
                    }
                }
            },
            show: true
        },
        series: [{
            name: 'Tech Scope Distribution',
            type: 'pie',
            radius: [0, '40%'],
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
        }]
    };
    if (scope.noSwap === "true") {
        opt.toolbox.show = false;
    }
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
            gridSize: 0,
            sizeRange: [10, 20],
            // rotationRange: [0, 0],
            shape: 'circle',
            width: '100%',
            height: '100%',
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
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
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

function initWorldChartOpt(scope) {
    var opt = {
        title: {
            textStyle: {
                fontSize: 13
            }
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: false,
            trigger: 'axis',
            feature: {
                saveAsImage: {
                    show: true,
                    title: "Save as Image"
                }
            }
        },
        visualMap: {
            min: 0,
            // max: 1000000,
            // text: ['High', 'Low'],
            // realtime: false,
            // calculable: true,
            inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
            }
        },
        series: []
    };
    return opt;
}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}