module.exports = function ($scope, $location, $timeout, $filter, $http, $sce, $rootScope, CONST) {
    var moment = require('moment');
    // var socket = new WebSocket("ws://10.168.176.18/api/SystemDetected/");
    // $scope.Notifications = Notifications; //{date: "12/01/2016", dataSource: "su", messageType: 4, link: "somelink"}
    // $scope.Notifications.clearUnRead();
    // socket.addEventListener('message',function(m){
    //     // console.log(JSON.parse(m.data))
    //     $scope.$apply($scope.notifications.push(JSON.parse(m.data)));
    // })
    // console.log($scope.CONST.MESSAGE_TYPES);
    $scope.search = {
            datasource: 'all',
            messagetype: 'all',
            date: $filter('date')(new Date(), 'yyyy-MM-dd'),
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
            $scope.collections.push($scope.Notifications.collection.pop());
        }
    }, true)
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
            $scope.platforms = {
                'twitter': 'Twitter',
                'so': 'Stackoverflow',
                'sf': 'Serverfault',
                'su': 'Superuser',
                'msdn': 'MSDN',
                'tn': 'Telnet'
            };
            $('.ui.fluid.dropdown').dropdown({
                onChange: function (value, text, $choice) {
                    $scope.listNotification();
                }
            });
        }, 50)
    }();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });

    $scope.listNotification = function () {
        var params = angular.copy($scope.search);
        params.date = Math.floor(moment.utc(params.date) / 1000);
        console.log(params)
        $scope.service.getSysDetections(params.datasource, params.messagetype, params.downloadable, params.date).then(function (data) {
            // console.log(data);
            $scope.collections = angular.merge($scope.collections, data);
        })
    }
    $scope.listNotification();
    $scope.adaltest = function () {
        $http({
            url: 'https://garyphp.azurewebsites.net/api.php',
            method: 'get'
        }).then(function (data) {
            console.log(data);
        })
    }
    $scope.generateDownloadUrl = function (entity) {
        var downloadTemplate = '<a href="' + entity.link + '" target="_blank">Download Data</a>';
        return entity.hasDownload ? $sce.trustAsHtml(downloadTemplate) : 'N/A';
    }
    $scope.showdetails = function (entity) {
        var param = {
            platform: 'all',
            topic: 'azure',
            date: Math.floor(moment.utc($scope.search.date) / 1000)
        }
        $rootScope.popSubWin({
            fn: 'getVoCDetailsByDate',
            param: param
        });
    }
}