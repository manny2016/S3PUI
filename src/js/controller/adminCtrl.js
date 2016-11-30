module.exports = function ($scope, $location, $timeout) {
    // console.log("this is admin");  

    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform',platform)
    }
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn']
        }, 500)
    } ();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });
}