module.exports = function ($scope, $rootScope, $window, $timeout, $http, $q, $sce, $compile, $document, $websocket, CONST, utilitySrv) {
    //// the time is UTC date time value in locale timezone in here.
    //// example: CST (GMT+8), now is 2017-01-01 09:00:00 in locale, it should be "2017-01-01 01:00:00 GMT+0800 (China Standard Time)"
    var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    var today = parseInt((new Date()).valueOf() / 86400000) * 86400000 + timezoneOffset;
    var start = new Date(today - 86400000 * 7), end = new Date(today - 86400000);
    var outset = new Date(2016, 7, 1);
    function datetimeChanged() {
        var dtStart = dtpStart.value();
        var dtEnd = dtpEnd.value();

        if (dtStart) {
            dtpEnd.min(dtStart);
            dtpEnd.max(new Date(Math.min(end, dtStart.valueOf() + 86400000 * 364)));
        }
        if (dtEnd) {
            dtpStart.min(new Date(Math.max(outset, dtEnd.valueOf() - 86400000 * 364)));
            dtpStart.max(dtEnd);
        }

        $scope.startDateLocalsString = (new Date(dtStart.valueOf() - timezoneOffset)).toLocaleString();
        $scope.endDateLocalsString = (new Date(dtEnd.valueOf() + 86400000 - timezoneOffset)).toLocaleString();
        $scope.$apply();
        $scope.startGetData($rootScope.global.topic);
    }
    $("#ddlQuicklyTest").kendoDropDownList({
        change: function (e) {
            var value = this.value();
            var dtStart = new Date(today - 3600000 * 24 * value);
            var dtEnd = new Date(today - 3600000 * 24);
            dtpStart.value(dtStart);
            dtpEnd.min(dtStart);
            dtpEnd.max(new Date(Math.min(end, dtStart.valueOf() + 86400000 * 364)));
            dtpEnd.value(dtEnd);
            dtpStart.min(new Date(Math.max(outset, dtEnd.valueOf() - 86400000 * 364)));
            dtpStart.max(dtEnd);
            $scope.startGetData($rootScope.global.topic);
        }
    });
    var dtpStart = $('#DateTimePickerStart').kendoDatePicker({
        value: start,
        format: localeDateFormatString,
        change: datetimeChanged,
        min: new Date(Math.max(outset, end.valueOf() - 86400000 * 364)),
        max: end
    }).data("kendoDatePicker");
    var dtpEnd = $('#DateTimePickerEnd').kendoDatePicker({
        value: end,
        format: localeDateFormatString,
        change: datetimeChanged,
        min: start,
        max: end
    }).data("kendoDatePicker");



    $scope.query = {
        granularity: 3, //// daily
        start: start,
        end: end
    };
    $scope.startDateLocalsString = (new Date(start - timezoneOffset)).toLocaleString();
    $scope.endDateLocalsString = (new Date(today - timezoneOffset)).toLocaleString();
    // var totalrequests = 28+12;
    var sections = 8,
        totalrequests = 0;
    // $('#progress').progress();
    $scope.flags = {
        m: false,
        g: false,
        r: false
    };
    $('.popup').popup();
    $('#scrollspy .list .item .label').popup();
    $('.ui.accordion').accordion({
        exclusive: false,
        animateChildren: false,
        selector: {
            trigger: '.segment .title',
            content: '.segment .content'
        },
        // className:{
        //     active:'content active'
        // },
        onOpen: function () {
            // debugger;
            $(this).find('.ui.segment').removeClass('visible');
            $(this).find('div.echart').map(function (index, currentObj, array) {
                echarts.getInstanceByDom(currentObj).resize();
            })
        }
    })

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }

    // Top Seclectors data
    $scope.getTopics = function () {
        $scope.service.getCate().then(function (data) {
            $scope.topics = data;
            if ($rootScope.global.topic) {
                $scope.startGetData($rootScope.global.topic);
            }
        })
    }();

    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
        $('.tabular.menu .item').tab({
            onVisible: function (tab) {
                var chartDom = $('.ui.tab[data-tab="' + tab + '"]').find('div.echart').get(0);
                if (chartDom) {
                    echarts.getInstanceByDom(chartDom).resize();
                }
            }
        })
        //$scope.$broadcast('on-show');
        $('#progress').progress('increment');
        if ($('#progress').progress('get value') === $scope.totalrequests) {
            $timeout(function () {
                $('#progress').hide()
            }, 1000)
        }
    });

    $scope.startGetData = function (topic) {
        if (topic) {            
            $rootScope.global.topic = topic;
            $scope.flags.m = false;
            $('div.echart').map(function () {
                console.log(this.id);
                echarts.getInstanceByDom(this).clear();
            })
            $('#progress').progress('reset');
            $('#progress').show();

            var dtStart = dtpStart.value(), dtEnd = dtpEnd.value();
            dtStart = dtStart.valueOf() - timezoneOffset;
            dtEnd = dtEnd.valueOf() - timezoneOffset;
            $scope.query.start = dtStart;
            $scope.query.end = dtEnd;
            var offsetDays = (dtEnd - dtStart) / 3600 / 24 / 1000;
            $('#volumes > div.content > div:nth-child(2)')
                .attr('class', 'ui ' + (offsetDays <= 30 ? 'three' : (offsetDays <= 60 ? 'two' : 'one')) + ' column grid');

            if ($scope.query.topic !== topic) {
                $scope.enabledPlatforms = [];                
                $scope.query.topic = topic;
                $timeout(function () {
                    $scope.topics.forEach(function (item) {
                        if (item.TechCategoryName.toLowerCase() === topic.toLowerCase()) {
                            item.Platforms.forEach(function (p) {
                                if (p.isEnabled) $scope.enabledPlatforms.push(p.PlatformName)                                
                            })
                        }
                    })
                    $scope.totalrequests = sections * $scope.enabledPlatforms.length + totalrequests;
                    $('#progress').progress({
                        total: $scope.totalrequests
                    });
                    $scope.selected = $scope.enabledPlatforms[0];
                    $scope.listNotification(5);
                    $scope.$apply();                    
                }, 50)
            } else {
                $scope.$broadcast('start-get-data', 'home');
                $scope.selected = $scope.enabledPlatforms[0];
            }
        }
    }

    //list latest top {number} notifications
    $scope.listNotification = function (top) {
        var date = Math.floor(moment.utc().add(-1, "days").startOf('day') / 1000);
        $scope.service.getSysDetections(undefined, undefined, $rootScope.global.topic, undefined, date).then(function (data) {
            $scope.collections = data.splice(0, top);
        })
    }
    $scope.generateDownloadUrl = function (entity) {
        var downloadTemplate = '<a href="' + entity.link + '" target="_blank">Download Data</a>';
        return entity.hasDownload ? $sce.trustAsHtml(downloadTemplate) : 'N/A';
    }
    $scope.showdetails = function (entity) {
        var param = {
            id: entity.id,
            platform: entity.forumName,
            msgType: entity.msgType,
            topic: entity.topic,
            date: entity.TimeStamp
        }
        $rootScope.popSubWin({
            fn: 'getVoCDetailsBySpikeDetected',
            param: param
        });
    }

    $scope.finished = function () {
        $timeout(function () {
            $scope.$broadcast('start-get-data', 'home');
        }, 50)
    }

    function listenServiceStatus() {
        try {
            $http.get(CONST.SERVICE_INFO.TWITTER_SERVER_STATUS).then(function (data) {
                $scope.twitter_status = data.data
            });
        }
        catch (err) { console.log('connection Error', err); }
        try {
            $http.get(CONST.SERVICE_INFO.OTHERS_SERVER_STATUS).then(function (data) {
                $scope.others_status = data.data
            });
        }
        catch (err) { console.log('connection Error', err); }
    }
    listenServiceStatus();
    $scope.getServiceStatus = function () {
        setInterval(listenServiceStatus, 1000 * 60);
    }
    $scope.getServiceStatus();
}