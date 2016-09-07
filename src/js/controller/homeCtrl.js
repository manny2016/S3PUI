module.exports = function ($scope, $timeout, $q,rawdataSrv) {
    $scope.flags = {
        b: false,
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

    rawdataSrv.getCate().then(function(data){
        console.log(data)
    })

    // showFlags()

}