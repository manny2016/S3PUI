module.exports = function ($scope, $rootScope, $window, $timeout, $http, $q, $sce, $compile, $document, $websocket, CONST, utilitySrv) {
    //// the time is UTC date time value in locale timezone in here.
    //// example: CST (GMT+8), now is 2017-01-01 09:00:00 in locale, it should be "2017-01-01 01:00:00 GMT+0800 (China Standard Time)"
    var today = parseInt((new Date()).valueOf() / 3600000 / 24) * 24 * 3600000 + (new Date()).getTimezoneOffset() * 60000;
    var start = new Date(today - 3600000 * 24 * 7), end = new Date(today - 3600000 * 24), outset = new Date(today - 3600000 * 24 * 30);
    function datetimeChanged() {
        var dtStart = dtpStart.value();
        var dtEnd = dtpEnd.value();

        if (dtStart) {
            dtpEnd.min(new Date(dtStart));
        }
        if (dtEnd) {
            dtpStart.max(new Date(dtEnd));
        }
        $scope.startGetData($rootScope.global.topic);
    }
    var dtpStart = $('#DateTimePickerStart').kendoDatePicker({
        value: outset,//start,
        format: localeDateFormatString,
        change: datetimeChanged,
        min: new Date(2017, 0, 1),//outset,
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
        granularity: 3 //// daily
    };
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
            console.log($(this).find('.ui.segment.visible'))
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
            // console.log(data)
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
                console.log(tab);
                var chartDom = $('.ui.tab[data-tab="' + tab + '"]').find('div.echart').get(0);
                if (chartDom) {
                    echarts.getInstanceByDom(chartDom).resize();
                }
            }
        })
        //$scope.$broadcast('on-show');
        $('#progress').progress('increment');
        // console.log($('#progress').progress('get value'))
        if ($('#progress').progress('get value') === $scope.totalrequests) {
            $timeout(function () {
                $('#progress').hide()
            }, 1000)
        }
    });

    $scope.startGetData = function (topic) {
        $rootScope.global.topic = topic;
        $scope.flags.m = false;
        $('div.echart').map(function () {
            echarts.getInstanceByDom(this).clear();
        })
        $('#progress').progress('reset');
        $('#progress').show();

        var dtStart = dtpStart.value(), dtEnd = dtpEnd.value();
        dtStart = dtStart.valueOf() - dtStart.getTimezoneOffset() * 60000;
        dtEnd = dtEnd.valueOf() - dtEnd.getTimezoneOffset() * 60000;
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
            }, 50)
        } else {
            $scope.$broadcast('start-get-data', 'home');
            $scope.selected = $scope.enabledPlatforms[0];
        }
    }

    //list latest top {number} notifications
    $scope.listNotification = function (top) {
        var date = Math.floor(moment.utc().add(-1, "days").startOf('day') / 1000);
        $scope.service.getSysDetections(undefined, undefined, $rootScope.global.topic, undefined, date).then(function (data) {
            // console.log(data);
            $scope.collections = data.splice(0, top);
        })
    }
    $scope.generateDownloadUrl = function (entity) {
        var downloadTemplate = '<a href="' + entity.link + '" target="_blank">Download Data</a>';
        return entity.hasDownload ? $sce.trustAsHtml(downloadTemplate) : 'N/A';
    }
    $scope.showdetails = function (entity) {
        var param = {
            platform: entity.forumName,
            msgType: entity.msgType,
            topic: entity.topic,
            timestamp: entity.TimeStamp
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