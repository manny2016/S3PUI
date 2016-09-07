module.exports = function ($scope, $rootScope, $timeout, $q, rawdataSrv, testSrv) {
    var totalrequests = 30;
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

    testSrv.getCate().then(function (data) {
        console.log(data)
    })

    $scope.$on('data-get', function (event, arg) {
        $scope.flags.m = true;
        $('#progress').progress('increment');
        console.log($('#progress').progress('get value'))
        if ($('#progress').progress('get value')===totalrequests) {
            $timeout(function(){
                $('#progress').hide()
            },1000)
        }
        $timeout(function () {
            arg.resize();
        }, 500)
    });

    $scope.startGetData = function () {
        $scope.$broadcast('start-get-data');
    }
}