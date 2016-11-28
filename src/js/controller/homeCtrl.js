module.exports = function ($scope, $rootScope, $timeout, $q, $compile ,$document) {
    $scope.query = {};
    // var totalrequests = 28+12;
    var sections = 8,
        totalrequests = 0;
    // $('#progress').progress();
    $scope.flags = {
        m: false,
        g: false,
        r: false
    };
    $('#scrollspy .list .item .label').popup();
    $('.ui.accordion').accordion({
        exclusive: false,
        selector: {
            trigger: '.segment .title'
        },
        onOpen: function () {
            // debugger;
            console.log(this)
            $(this).find('div.echart').map(function (index,currentObj,array) {
                echarts.getInstanceByDom(currentObj).resize();
            })
        }
    })
    //social Health section UI controller
    $scope.swapTab = function (platform) {
        $scope.selected = platform;
        $('.ui.tabular.menu').tab('change tab', platform);
        // debugger;
        var chartDom = $('.ui.tab[data-tab="' + platform + '"]').find('div.echart').get(0);
        if (chartDom) {
            echarts.getInstanceByDom(chartDom).resize();
        }
    }
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
    // $scope.getTopics();


    $scope.$on('data-got', function (event, arg) {
        $scope.flags.m = true;
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
                $scope.totalrequests = sections * $scope.enabledPlatforms.length + totalrequests;
                $('#progress').progress({
                    total: $scope.totalrequests
                });
                $scope.selected = $scope.enabledPlatforms[0];
            }, 50)
        } else {
            // $scope.enabledPlatforms=[];
            // $rootScope.$broadcast('destory-charts', 'home');
            $scope.$broadcast('start-get-data', 'home');
            $scope.selected = $scope.enabledPlatforms[0];
        }
    }

    $scope.finished = function () {
        $timeout(function () {
            $scope.$broadcast('start-get-data', 'home');
        }, 50)
    }

}