module.exports = function ($scope, $rootScope, $timeout, $q, $compile) {
    $scope.query = {};
    var totalrequests = 28+12;
    $('#progress').progress({
        total: totalrequests
    });
    $scope.flags = {
        m: false,
        g: false,
        r: false
    };
    $('#scrollspy .list .item .label').popup();

    $timeout(function () {
        $scope.flags.g = true;
    }, 2000).then(function () { 
        $timeout(function () {
            $scope.flags.r = true;
        }, 2000)
    })
    $scope.getTopics = function () {
        $scope.service.getCate().then(function (data) {
            // console.log(data)
            $scope.topics = data;
            if($rootScope.global.topic){
                $scope.startGetData($rootScope.global.topic);
            }
        })
    }
    $scope.getTopics();
    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
        //$scope.$broadcast('on-show');
        $('#progress').progress('increment');
        //console.log($('#progress').progress('get value'))
        if ($('#progress').progress('get value') === totalrequests) {
            $timeout(function () {
                $('#progress').hide()
            }, 1000)
        }
        //$timeout(function () {
        //    //console.log(arg)
        //    arg.resize();
        //},500)
    });

    $scope.startGetData = function (topic) {
        $rootScope.global.topic = topic;
        $scope.flags.m = false;
        $('div.echart').map(function () {
            echarts.getInstanceByDom(this).clear();
        })
        $('#progress').progress('reset');
        $('#progress').show();
        if ($scope.query.topic !== topic) {
            $scope.enabledPlatforms = [];
            $scope.query.topic = topic
            // console.log($scope);
            $timeout(function () {
                $scope.topics.forEach(function (item) {
                    if (item.TechCategoryName.toLowerCase() === topic.toLowerCase()) {
                        item.Platforms.forEach(function (p) {
                            if (p.isEnabled) $scope.enabledPlatforms.push(p.PlatformName)
                        })
                    }
                })
            }, 50)
        } else {
            // $scope.enabledPlatforms=[];
            // $rootScope.$broadcast('destory-charts', 'home');
            $scope.$broadcast('start-get-data', 'home');
        }
    }

    $scope.finished = function () {
        $timeout(function () {
            $scope.$broadcast('start-get-data', 'home');
        }, 50)
    }

}