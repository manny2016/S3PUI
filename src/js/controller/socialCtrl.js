module.exports = function ($scope, $rootScope, $window, $timeout, $filter, $document, $location, CONST, utilitySrv, toastr) {
    $scope.platform = $scope.$stateParams.platform.toLowerCase();
    $scope.order = $filter('orderBy');
    $scope.query = {};
    $scope.queried = false;
    $scope.path = $location.path().split("/");
    $scope.isLargeDateRange = false;
    $scope.popInfoScope = "Hourly";
    var totalrequests = 0;

    //// the time is UTC date time value in locale timezone in here.
    //// example: CST (GMT+8), now is 2017-01-01 09:00:00 in locale, it should be "2017-01-01 01:00:00 GMT+0800 (China Standard Time)"
    var settings = {};
    {
        settings.timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
        var now = (new Date()).valueOf() - settings.timezoneOffset;
        settings.today = parseInt(now / 86400000) * 86400000;
        settings.daily_outset = (new Date(2016, 7, 1)).valueOf() - settings.timezoneOffset;
        settings.daily_start = settings.today - 86400000 * 7;
        settings.daily_end = settings.today - 86400000;
        settings.hourly_outset = (new Date(2016, 7, 1)).valueOf();
        settings.hourly_end = (parseInt(now / 3600000) * 3600000) + settings.timezoneOffset;
        settings.hourly_start = settings.hourly_end - 86400000 * 7;
    }
    var optionsViewModel = kendo.data.Model.define({
        fields: {
            topic: { defaultValue: $rootScope.global.topic },
            granularity: { type: "number", defaultValue: 3 },
            startForDaily: { type: "number", defaultValue: settings.daily_start },
            endForDaily: { type: "number", defaultValue: settings.daily_end },
            startForHourly: { type: "number", defaultValue: settings.hourly_start },
            endForHourly: { type: "number", defaultValue: settings.hourly_end }
        },
        start: function () {
            var granularity = this.get('granularity');
            return granularity === 2
                ? this.get('startForHourly')
                : this.get('startForDaily');
        },
        end: function () {
            var granularity = this.get('granularity');
            return granularity === 2
                ? this.get('endForHourly')
                : this.get('endForDaily') + 86400000;
        }
    });
    var options = kendo.observable(new optionsViewModel());
    $scope.query.topic = options.get('topic');
    $scope.query.granularity = options.get('granularity');
    $scope.query.start = options.get('start()');
    $scope.query.end = options.get('end()');
    $scope.query.days = 7;

    function setDateRangeSectionVisible() {
        if (options.get('granularity') === 2) {
            $('.daterange-daily').hide();
            $('.daterange-hourly').show();
        } else {
            $('.daterange-daily').show();
            $('.daterange-hourly').hide();
        }
    }
    function datetimeChanged(start, end, base) {
        //// base
        ////    2x: hourly,        3x: daily
        ////    x0: base on start, x1: base on end
        (function hourly(start, end) { //// hourly
            start = Math.max(start, settings.hourly_outset);
            end = Math.min(end, settings.hourly_end);
            var start_min = Math.max(end - 86400000 * 7, settings.hourly_outset);
            var start_max = end - 3600000;
            var end_min = start + 3600000;
            var end_max = Math.min(start + 86400000 * 7, settings.hourly_end);
            switch (base) {
                case 0: //// base on start
                    end = Math.min(Math.max(end_min, end), end_max);
                    start_min = Math.max(end - 86400000 * 7, settings.hourly_outset);
                    start_max = end - 3600000;
                    break;
                case 1: //// base on end
                    start = Math.min(Math.max(start_min, start), start_max);
                    end_min = start + 3600000;
                    end_max = Math.min(start + 86400000 * 7, settings.hourly_end);
                    break;
            }
            // console.log('hourly start min:', start_min, new Date(start_min));
            // console.log('hourly start    :', start, new Date(start));
            // console.log('hourly start max:', start_max, new Date(start_max));
            // console.log('hourly   end min:', end_min, new Date(end_min));
            // console.log('hourly   end    :', end, new Date(end));
            // console.log('hourly   end max:', end_max, new Date(end_max));

            options.set('startForHourly', start);
            options.set('endForHourly', end);
            hourlyPickerStart.min(new Date(start_min));
            hourlyPickerStart.max(new Date(start_max));
            hourlyPickerStart.value(new Date(start));
            hourlyPickerEnd.min(new Date(end_min));
            hourlyPickerEnd.max(new Date(end_max));
            hourlyPickerEnd.value(new Date(end));
        })(start, end);
        (function daily(start, end) { //// daily
            start = parseInt(start / 86400000) * 86400000;
            end = parseInt(end / 86400000) * 86400000;
            start = Math.max(start, settings.daily_outset);
            end = Math.min(end, settings.daily_end);
            var start_min = Math.max(end - 86400000 * 364, settings.daily_outset);
            var start_max = end;
            var end_min = start;
            var end_max = Math.min(start + 86400000 * 364, settings.daily_end);
            switch (base) {
                case 0: //// base on start
                    end = Math.min(Math.max(end_min, end), end_max);
                    start_min = Math.max(end - 86400000 * 364, settings.daily_outset);
                    start_max = end;
                    break;
                case 1: //// base on end
                    start = Math.min(Math.max(start_min, start), start_max);
                    end_min = start;
                    end_max = Math.min(start + 86400000 * 364, settings.daily_end);
                    break;
            }
            console.log('daily  start min:', start_min, new Date(start_min), new Date(start_min + settings.timezoneOffset));
            console.log('daily  start    :', start, new Date(start), new Date(start + settings.timezoneOffset));
            console.log('daily  start max:', start_max, new Date(start_max), new Date(start_max + settings.timezoneOffset));
            console.log('daily    end min:', end_min, new Date(end_min), new Date(end_min + settings.timezoneOffset));
            console.log('daily    end    :', end, new Date(end), new Date(end + settings.timezoneOffset));
            console.log('daily    end max:', end_max, new Date(end_max), new Date(end_max + settings.timezoneOffset));

            options.set('startForDaily', start);
            options.set('endForDaily', end);
            dailyPickerStart.min(new Date(start_min + settings.timezoneOffset));
            dailyPickerStart.max(new Date(start_max + settings.timezoneOffset));
            dailyPickerStart.value(new Date(start + settings.timezoneOffset));
            dailyPickerEnd.min(new Date(end_min + settings.timezoneOffset));
            dailyPickerEnd.max(new Date(end_max + settings.timezoneOffset));
            dailyPickerEnd.value(new Date(end + settings.timezoneOffset));
        })(start, end);
    }


    var dropdownlistProducts = $("#ddlProducts").kendoDropDownList({
        dataSource: {
            transport: {
                read: {
                    url: CONST.SERVICE_INFO.ENDPOINT + 'GetAllEnabledTopicsByPlatform',
                    dataType: "json",
                    data: {
                        platform: $scope.$stateParams.platform,
                        cachedtimestamp: (new Date()).getTime()
                    }
                }
            },
            schema: {
                data: function (response) {
                    var topics = []
                    response.map(function (item) {
                        if (item.isGA) {
                            var flag = false;
                            item.Platforms.map(function (obj) {
                                if (obj.PlatformName.toLowerCase() === $scope.$stateParams.platform) {
                                    flag = obj.isEnabled;
                                }
                            })
                            if (flag) {
                                topics.push(item.TechCategoryName);
                            }
                        }
                    })
                    $scope.topics = topics;
                    return topics;
                }
            }
        },
        change: function (e) {
            var topic = this.value();
            options.set('topic', topic);
        }
    }).data("kendoDropDownList");
    $("#ddlGranularities").kendoDropDownList({
        value: options.get('granularity'),
        change: function (e) {
            var granularity = parseInt(this.value());
            options.set('granularity', granularity);
            setDateRangeSectionVisible();
        }
    });
    var dailyPickerStart = $('#DailyPickerStart').kendoDatePicker({
        min: new Date(settings.daily_outset + settings.timezoneOffset),
        max: new Date(settings.daily_end + settings.timezoneOffset),
        value: new Date(options.get('startForDaily') + settings.timezoneOffset),
        format: localeDateFormatString,
        change: function () {
            var start = dailyPickerStart.value().valueOf() - settings.timezoneOffset;
            var end = dailyPickerEnd.value().valueOf() - settings.timezoneOffset;
            datetimeChanged(start, end, 0);
        }
    }).data("kendoDatePicker");
    var dailyPickerEnd = $('#DailyPickerEnd').kendoDatePicker({
        min: new Date(options.get('startForDaily') + settings.timezoneOffset),
        max: new Date(settings.daily_end + settings.timezoneOffset),
        value: new Date(options.get('endForDaily') + settings.timezoneOffset),
        format: localeDateFormatString,
        change: function () {
            var start = dailyPickerStart.value().valueOf() - settings.timezoneOffset;
            var end = dailyPickerEnd.value().valueOf() - settings.timezoneOffset;
            datetimeChanged(start, end, 1);
        }
    }).data("kendoDatePicker");
    var hourlyPickerStart = $('#HourlyPickerStart').kendoDateTimePicker({
        min: new Date(settings.hourly_start),
        max: new Date(settings.hourly_end),
        value: new Date(options.get('startForHourly')),
        interval: 60,
        format: localeDateTimeFormatString,
        change: function () {
            var start = hourlyPickerStart.value().valueOf();
            var end = hourlyPickerEnd.value().valueOf();
            datetimeChanged(start, end, 0);
        }
    }).data("kendoDateTimePicker");
    var hourlyPickerEnd = $('#HourlyPickerEnd').kendoDateTimePicker({
        min: new Date(options.get('startForHourly')),
        max: new Date(settings.hourly_end),
        value: new Date(options.get('endForHourly')),
        format: localeDateTimeFormatString,
        interval: 60,
        change: function () {
            var start = hourlyPickerStart.value().valueOf();
            var end = hourlyPickerEnd.value().valueOf();
            datetimeChanged(start, end, 1);
        }
    }).data("kendoDateTimePicker");
    setDateRangeSectionVisible();

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

    $('#scrollspy .list .item .label').popup();
    // var count = 0;

    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
        $('#progress').progress('increment');
        if ($('#progress').progress('get value') === totalrequests) {
            $timeout(function () {
                $('#progress').hide()
            }, 1000)
        }
    });

    function updateQueryConditions() {
        var topic = options.get('topic');
        if (!topic) {
            topic = dropdownlistProducts.value();
            options.set('topic', topic);
        }
        $scope.query.topic = topic;
        $scope.query.granularity = options.get('granularity');
        $scope.query.start = options.get('start()');
        $scope.query.end = options.get('end()');
        $scope.startDateLocalsString = (new Date($scope.query.start)).toLocaleString();
        $scope.endDateLocalsString = (new Date($scope.query.end)).toLocaleString();
    }
    $scope.doQuery = function (e) {
        updateQueryConditions();
        $scope.queried = true;
        $scope.startGetData();
    }
    $scope.doDownload = function () {
        updateQueryConditions();
        
        if (!$scope.$stateParams.platform) {
            toastr.error('Platform Required');
            return false;
        }
        if (!$scope.query.topic) {
            toastr.error('Topic Select Required');
            return false;
        }

        var granularity = $scope.query.granularity || 3;
        var start = $scope.query.start / 1000;
        var end = ($scope.query.end + (granularity == 2 ? 3600000 : 3600000 * 24)) / 1000;
        var url = CONST.SERVICE_INFO.ENDPOINT
            + 'DownloadSummary'
            + '?stamp=' + (new Date()).valueOf()
            + '&platform=' + escape($scope.$stateParams.platform || 'twitter')
            + '&topic=' + escape($scope.query.topic || 'azure')
            + '&fromcycle=' + granularity
            + '&start=' + start
            + '&end=' + end;
        window.open(url);
    }
    $scope.startGetData = function () {
        // $event.stopPropagation();
        // $event.preventDefault();
        if (!$scope.query.topic) {
            //alert('Need to select a topic!');
            return false;
        }
        $rootScope.global.topic = $scope.query.topic;
        $scope.flags.m = false;
        $scope.query.days = ($scope.query.end - $scope.query.start) / 1000 / 3600 / 24;
        $scope.isLargeDateRange = ($scope.query.days > 7);
        $('div.echart').map(function () {
            echarts.getInstanceByDom(this).clear();
        })
        $('#progress').progress('reset');
        $('#progress').show();
        getStatistic();
        getUserDistribution();
        getMentionedServiceTable();
        //getLanguageDistribution();
        $scope.$broadcast('start-get-data', 'home');
    }
    function getStatistic() {
        $('#summary div.content').dimmer('show');
        $scope.service.getImpactSummary($scope.$stateParams.platform, $scope.query.topic, 'all', $scope.query).then(function (data) {
            var influenceData = data.vocinsights.objectcountthistime;
            $scope.serviceStatus = 'gery';
            $scope.statistic = data;
            $('#summary div.content').dimmer('hide');
            $scope.$broadcast('data-got');
        })
    }
    function getUserDistribution() {
        $scope.service.getRegionDistribution($scope.$stateParams.platform, $scope.query.topic, 'all', $scope.query).then(function (data) {
            $scope.languageDistribution = $filter('orderBy')(data, '-uniqueusers');
        })
    }
    function getMentionedServiceTable() {
        $scope.service.getMentionedMostServiceList($scope.$stateParams.platform, $scope.query.topic, 'all', $scope.query).then(function (data) {
            $scope.mostMentionedService = data
            $scope.$broadcast('data-got');
        })
    }

    function RefreshCharts() {
        $timeout(function () {
            $scope.startGetData()
            $('.large-date-range').find('div.echart').map(function (index, currentObj, array) {
                echarts.getInstanceByDom(currentObj).resize();
            })
            $scope.$apply()
        }, 0);
    }
}