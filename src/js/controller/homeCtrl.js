module.exports = function ($scope, $rootScope, $timeout, $q, rawdataSrv, testSrv) {
    $scope.query = {};
    var totalrequests = 28;
    $('#progress').progress({
        total: totalrequests
    });
    $scope.flags = {
        m: false,
        g: false,
        r: false
    };

    $timeout(function () {
        $scope.flags.g = true;
    }, 2000).then(function () {
        $timeout(function () {
            $scope.flags.r = true;
        }, 2000)
    })

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
        $scope.flags.m = false;
        $('div.echart').map(function(){
            echarts.getInstanceByDom(this).clear();
        })
        $('#progress').progress('reset');
        $('#progress').show();
        $scope.query.topic = topic;
        $scope.$broadcast('start-get-data', 'home');
    }
}