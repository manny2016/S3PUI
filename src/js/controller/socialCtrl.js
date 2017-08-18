module.exports = function ($scope, $rootScope, $window, $timeout, $filter, $document, $location, utilitySrv, toastr) {
    $scope.platform = $scope.$stateParams.platform.toLowerCase();
    $scope.order = $filter('orderBy');
    $scope.query = {};
    $scope.path = $location.path().split("/");
    $scope.isLargeDateRange = false;
    $scope.popInfoScope = "Hourly";
    var totalrequests = 0;

    //// the time is UTC date time value in locale timezone in here.
    //// example: CST (GMT+8), now is 2017-01-01 09:00:00 in locale, it should be "2017-01-01 01:00:00 GMT+0800 (China Standard Time)"
    var settings = {};
    settings.timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    settings.now = (parseInt((new Date()).valueOf() / 3600000) * 3600000);
    settings.today = parseInt(settings.now / 3600000 / 24) * 24 * 3600000;
    settings.start = settings.today - 3600000 * 24 * 7;
    settings.end = settings.today - 3600000 * 24;
    $scope.query.granularity = 3;
    $scope.query.start = settings.start;
    $scope.query.end = settings.end;
    $scope.query.days = 7;

    var dailyContainer = $($("#topic_select > div:nth-child(1) > div:nth-child(2) > span.daterange")[0]);
    var hourlyContainer = $($("#topic_select > div:nth-child(1) > div:nth-child(2) > span.daterange")[1]);
    dailyContainer.children("input:nth-child(2)").attr('max', (new Date(settings.end)).toISOString());
    hourlyContainer.children("input:nth-child(2)").attr('max', (new Date(settings.now - 3600000 + settings.timezoneOffset)).toISOString());
    var selectedDateRange = kendo.observable({
        granularity: $scope.query.granularity,
        start: new Date($scope.query.start + settings.timezoneOffset),
        end: new Date($scope.query.end + settings.timezoneOffset),

        granularities: [{ text: "Daily", value: 3 }, { text: "Hourly", value: 2 }],
        visibleDateTimePicker: function () { return this.get('granularity') === 2; },
        visibleDatePicker: function () { return this.get('granularity') !== 2; }
    });
    selectedDateRange.bind('change', function (e) {
        if (e.field === 'granularity') {
            var granularity = this.get('granularity');
            $scope.query.granularity = granularity;
            if (granularity === 2) {
                $scope.popInfoScope = "Hourly";
            } else {
                $scope.popInfoScope = "Daily";
                var start = this.get('start');
                var end = this.get('end');
                if (start > settings.end) {
                    this.set('start', new Date(settings.start + settings.timezoneOffset));
                }
                if (end > settings.end) {
                    this.set('end', new Date(settings.end + settings.timezoneOffset))
                }
            }
            $scope.startGetData();
        } else if (e.field === 'start') {
            var start = this.get('start').valueOf() - settings.timezoneOffset;
            $scope.query.start = start;
            CheckDateRangeSize();
        } else if (e.field === 'end') {
            var end = this.get('end').valueOf() - settings.timezoneOffset;
            $scope.query.end = end;
            CheckDateRangeSize();
        }
    });
    kendo.bind($("#topic_select > div:nth-child(1) > div:nth-child(2)"), selectedDateRange);

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

    $scope.$watch('topic', function (nv, ov) {
        if (nv) {
            $scope.startGetData()
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

                // add GA decision
                // if (item.isGA) {
                item.Platforms.map(function (obj) {
                    if (obj.PlatformName.toLowerCase() == $scope.$stateParams.platform) {
                        flage = obj.isEnabled;
                    }
                })
                // console.log(item.TechCategoryName,flage)
                if (flage) $scope.topics.push(item.TechCategoryName)
                // }

            })
            $('#topic_select').dimmer('hide');
            if ($scope.topics.indexOf($rootScope.global.topic) !== -1) {
                $scope.topic = $rootScope.global.topic;
                $scope.startGetData()
                // $('#topicSelection').dropdown('set text', $rootScope.global.topic)
            }
        })
    }
    $timeout(function () {
        $scope.getTopics();
    }, 0)
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

    $scope.startGetData = function () {
        // $event.stopPropagation();
        // $event.preventDefault();
        if (!$scope.topic) {
            //alert('Need to select a topic!');
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
        getStatistic();
        getUserDistribution();
        getMentionedServiceTable();
        //getLanguageDistribution();
        $scope.$broadcast('start-get-data', 'home');
    }
    $scope.getDownloadUrl = function () {
        if (!$scope.$stateParams.platform) {
            toastr.error('Platform Required');
            return false;
        }
        if (!$scope.topic) {
            toastr.error('Topic Select Required');
            return false;
        }
        $scope.service.getDownloadUrl($scope.$stateParams.platform, $scope.topic, $scope.query).then(function (url) {
            window.open(url);
        })
    }
    // initLineCharts('.hourly-charts.home');
    // echarts.connect('hourlyCharts');
    function getStatistic() {
        $('#summary div.content').dimmer('show');
        $scope.service.getImpactSummary($scope.$stateParams.platform, $scope.topic, 'all', $scope.query).then(function (data) {
            var influenceData = data.vocinsights.objectcountthistime;
            $scope.serviceStatus = 'gery';
            $scope.statistic = data;
            $('#summary div.content').dimmer('hide');
            $scope.$broadcast('data-got');
        })
    }
    function getUserDistribution() {
        $scope.service.getRegionDistribution($scope.$stateParams.platform, $scope.topic, 'all', $scope.query).then(function (data) {
            $scope.languageDistribution = $filter('orderBy')(data, '-uniqueusers');
        })
    }
    function getMentionedServiceTable() {
        $scope.service.getMentionedMostServiceList($scope.$stateParams.platform, $scope.topic, 'all', $scope.query).then(function (data) {
            $scope.mostMentionedService = data
            $scope.$broadcast('data-got');
        })
    }
    /*function getLanguageDistribution () {
        $scope.service.getUserLanguageDistribution($scope.$stateParams.platform, $scope.topic, $scope.query).then(function (data) {
            $scope.languageDistribution = $filter('orderBy')(data, '-volume');
        })
    }*/

    function CheckDateRangeSize() {
        $scope.query.days = ($scope.query.end - $scope.query.start) / 1000 / 3600 / 24;
        $scope.isLargeDateRange = ($scope.query.days > 7);
        $timeout(function () {
            $scope.startGetData();
            if ($scope.isLargeDateRange) {
                $('.large-date-range').find('div.echart').map(function (index, currentObj, array) {
                    echarts.getInstanceByDom(currentObj).resize();
                })
            }
            $scope.$apply();
        }, 0);
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