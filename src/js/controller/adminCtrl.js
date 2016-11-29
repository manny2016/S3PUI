module.exports = function ($scope, $location, $timeout) {
    // console.log("this is admin");  
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
                $scope.platforms = ['twitter','so','sf','su','msdn','tn']
            }, 500)
    }();  
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });
}