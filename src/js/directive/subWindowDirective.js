/*
    ==========example====================

*/
module.exports = /*@ngInject*/ function ($rootScope, $window, $compile, $filter, utilitySrv, CONST) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/sub_window.html?time='+new Date().getTime()),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "="
        },
        link: function (scope, e, a) {
            //console.log($(e).find('.hourly-charts'))
            scope.myChart = echarts.init($(e).find('.hourly-charts').get(0));
            scope.getData = function (params) {
                $window.threadOption = {
                    function: params.fn,
                    platform: params.param.platform.toLowerCase(),
                    topic: params.param.topic,
                    pnscope: params.param.pnscope,
                    days: params.param.days,
                    params: {
                        date: params.param.date,
                        country: params.param.country,
                        service: params.param.service,
                        userid: params.param.userid,
                        index: params.param.index,
                        keywords: params.param.keywords,
                        IsFuzzyQuery: params.param.IsFuzzyQuery,
                        msgType: params.param.msgType,
                        timestamp: params.param.timestamp
                    }
                };
                if ($window.threadStore) {
                    $window.threadStore.threads.data([]);
                    $window.threadStore.threads.page(1);
                    $window.threadStore.set("RefreshTrigger", !$window.threadStore.RefreshTrigger);
                }
                else {
                    $window.threadStore = kendo.observable({
                        RefreshTrigger: false,
                        threads: new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: CONST.SERVICE_INFO.ENDPOINT + "GetDetailsByComplexFilter",
                                    dataType: "json",
                                    type: "POST",
                                    contentType: "application/x-www-form-urlencoded"
                                },
                                parameterMap: function (data, operation)
                                {
                                    if (operation === "read") {
                                        var search;
                                        if (data.filter && data.filter.filters
                                            && data.filter.filters.length > 0) {
                                            search = data.filter.filters[0].value
                                        }
                                        $window.threadOption.search = search;
                                        var post = {
                                            function: $window.threadOption.function,
                                            platform: $window.threadOption.platform,
                                            topic: $window.threadOption.topic,
                                            pnscope: $window.threadOption.pnscope,
                                            days: $window.threadOption.days,
                                            params: {},
                                            search: search,
                                            page: data.page,
                                            pagesize: data.pageSize,
                                            sortby: data.sort[0] ? data.sort[0].field : 'created',
                                            sort: data.sort[0] ? data.sort[0].dir : 'desc',
                                        };
                                        if ($window.threadOption.params) {
                                            $.each($window.threadOption.params, function (field, value) {
                                                if (value) {
                                                    post.params[field] = value;
                                                }
                                            });
                                        }
                                        //console.log("get data:", post);
                                        return kendo.stringify(post);
                                    }
                                }
                            },
                            serverPaging: true,
                            pageSize: 10,
                            serverSorting: true,
                            sort: { field: "created", dir: "desc" },
                            serverFiltering: true,
                            schema: {
                                total: "count",
                                data: function (response) {
                                    var data = response.messagesorthreads;
                                    $.each(data, function (pos, data) {
                                        data.created = new Date(data.created * 1000);
                                    });
                                    return data;
                                }
                            }
                        })
                    });
                    kendo.bind($("#gridThreads"), $window.threadStore);
                }

                // console.log(params)
                scope.needMentioned = true;
                scope.platform = params.param.platform.toLowerCase()
                var fnPromise,
                    fn = $rootScope.service[params.fn];
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
                        scope.needMentioned=false;
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.service,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                    case 'getVoCDetailsByUser':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.userid,
                            params.param.index,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                    case 'getVoCDetailsByCountry':
                        fn = $rootScope.service['getVoCDetailsByPN'];
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.country,
                            params.param.days
                        )
                        break;
                    case 'getSubPageVoCDetails':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.date,
                            params.param.pnscope,
                            params.param.days
                        )
                        break;
                    case 'getSubPageVoCDetailsbyKeywords':
                        fnPromise = fn(params.param.platform,
                            params.param.topic,
                            params.param.keywords,
                            params.param.pnscope,
                            params.param.IsFuzzyQuery,
                            params.param.days
                        )
                        break;
                    case 'getVoCDetailsBySpikeDetected':
                        fnPromise = fn(params.param.platform,
                            params.param.msgType,
                            params.param.topic,
                            params.param.timestamp
                        )
                        break;
                }
                fnPromise.then(function (data) {
                    scope.raw = data;
                    scope.tabledata = data.messagesorthreads
                        // console.log(scope.tabledata);
                        // if(!scope.table){
                        //     scope.table = $compile($(e).find('#thread-table').get(0))(scope)
                        // }else{
                        // }

                    // scope.users = data.topusers 
                    scope.$broadcast('set-user-data', data.topusers);
                    scope.$broadcast('set-sub-widows-charts-data', {
                        data: data
                    });

                    scope.chartOpt = initHourlyChartData(data.volhourlylist, utilitySrv);
                    scope.myChart.setOption(scope.chartOpt);
                    scope.myChart.resize();
                    scope.complete = true;
                })
            }
            scope.$on('start-get-data-in-window', function (event, arg) {
                scope.raw = [];
                scope.tabledata = [];
                scope.chartOpt = {};
                scope.$broadcast('set-user-data', []);
                scope.getData(arg);
                scope.complete = false;
            });

            scope.getters = {
                twitterInf: function (value) {
                    return value.user.followers_count + value.user.friends_count;
                }
            };

            scope.swithside = function () {
                $('#shape-pup').shape('flip up')
            }
        }
    }
}

function initHourlyChartData(raw, utility) {
    var seriesData = [],
        xAxisDate = [];
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
                symbolSize: 4
            };
        }
        seriesData.push(entity);
    })
    var title = 'Volume Trend';
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