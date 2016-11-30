module.exports = function ($scope, $location, $timeout) {
    console.log("this is notification");  
    $('select.ui.fluid.dropdown').dropdown({
        onChange:function(value, text, $choice){
            console.log(value);
        }
    });
    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform',platform)
    }
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn'];
        }, 50)
    } ();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });
}