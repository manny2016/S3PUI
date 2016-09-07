module.exports = function ($scope, $timeout, $q) {
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


    // showFlags()

}