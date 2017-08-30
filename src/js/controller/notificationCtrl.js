module.exports = function ($scope, $location, $timeout, $filter, $http, $sce, $rootScope, CONST) {
    // var moment = require('moment');
    // var socket = new WebSocket("ws://10.168.176.18/api/SystemDetected/");
    // $scope.Notifications = Notifications; //{date: "12/01/2016", dataSource: "su", messageType: 4, link: "somelink"}
    // $scope.Notifications.clearUnRead();
    // socket.addEventListener('message',function(m){
    //     $scope.$apply($scope.notifications.push(JSON.parse(m.data)));
    // })
    $scope.getTopic = function () {
        $scope.topic = $rootScope.global.topic;
        if ($scope.topic.length === 0) {
            $scope.topic = 'all';
        }
    }();
    $scope.search = {
        datasource: 'all',
        topic: $scope.topic,
        messagetype: 'all',
        bgTime: $filter('date')((function (d) {
            d.setDate(d.getDate() - 1);
            return d
        })(new Date), 'yyyy-MM-dd'),
        egTime: $filter('date')(new Date(), 'yyyy-MM-dd'),
        downloadable: 'all'
    }
    // $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform', platform)
    }
    $scope.collections = function () {
        return $scope.Notifications.collection.splice(0);
    }();
    $scope.$watch('Notifications.collection', function (newV, oldV) {
        if (newV.length) {
            var notification = $scope.Notifications.collection.pop();
            if (((($scope.search.datasource || 'all') === 'all') || (notification.forumName === $scope.search.datasource))
                && ((($scope.search.topic || 'all') === 'all') || (notification.topic === $scope.search.topic))
                && ((($scope.search.messagetype || 'all') === 'all') || (notification.msgType === $scope.search.messagetype))
                && ((($scope.search.downloadable || 'all') === 'all') || (notification.hasDownload === ($scope.search.downloadable === 1 ? true : $scope.search.downloadable === -1 ? false : null)))
                ////&& (($scope.search.bgTime <= notification.createdTime) && (notification.createdTime < $scope.search.egTime))
            ) {
                $scope.collections.push(notification);
            }
        }
    }, true)
    // $scope.$watch('search', function (newV, oldV) {
    //     $scope.listNotification();
    // }, true)
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            // $scope.platforms = [{
            //     key: 'twitter',
            //     name: 'Twitter'
            // }, {
            //     key: 'so',
            //     name: 'Stackoverflow'
            // }, {
            //     key: 'sf',
            //     name: c
            // }, {
            //     key: 'su',
            //     name: 'Superuser'
            // }, {
            //     key: 'msdn',
            //     name: 'MSDN'
            // }, {
            //     key: 'tn',
            //     name: 'Telnet'
            // }];
            $scope.platforms = CONST.ALL_ENABLED_PLARFORMS
            $('.ui.fluid.dropdown').dropdown({
                // onChange: function (value, text, $choice) {
                //     $scope.listNotification();
                // }
            });
            $('.popup').popup();
        }, 50)
    }();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });

    $scope.listNotification = function () {
        $('#nc-main').dimmer('show');
        var params = angular.copy($scope.search);
        params.bgTime = Math.floor(moment.utc(params.bgTime) / 1000);
        params.egTime = Math.floor(moment.utc(params.egTime).endOf('day') / 1000);
        $scope.service.getSysDetections(params.datasource, params.messagetype, params.topic, params.downloadable, params.bgTime, params.egTime).then(function (data) {
            // $scope.collections = angular.extend($scope.collections, data);
            $('#nc-main').dimmer('hide');
            $scope.collections = data;
            // $scope.$digest();
        })
    }
    $scope.listNotification();
    $scope.generateDownloadUrl = function (entity) {
        var downloadTemplate = '<a href="' + entity.link + '" target="_blank">Download Data</a>';
        return entity.hasDownload ? $sce.trustAsHtml(downloadTemplate) : 'N/A';
    }
    $scope.showdetails = function (entity) {
        var param = {
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
    $scope.getTopics = function () {
        $scope.service.getCate().then(function (data) {
            $scope.topics = data;
            $scope.resolveTopics();
            //if ($rootScope.global.topic) {
            //    $scope.startGetData($rootScope.global.topic);
            //}
        })
    };
    $scope.resolveTopics = function () {
        if ($scope.search.topic != 'all') {
            if ($scope.topics) {
                var found = false;
                for (var i = 0; i < $scope.topics.length; i++) {
                    if ($scope.topics[i].TechCategoryName === $scope.search.topic) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    $scope.search.topic = 'all';
                }
            }
            else {
                $scope.topics = [{
                    TechCategoryName: $scope.search.topic,
                    isGA: true
                }];
            }
        }
    };
    $scope.getTopics();
    $scope.resolveTopics();
}