module.exports = function ($scope, $location, $timeout) {
    // console.log("this is admin");  

    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform', platform)
    }

    $scope.platforms = [];
    // $scope.getTopics = function () {
    //     $scope.service.getCate().then(function (data) {
    //         console.log(data)
    //         $scope.topics = data;
    //     })
    // }();
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            $scope.platforms = ['twitter', 'so', 'sf', 'su', 'msdn', 'tn']
        }, 500)
    }();
    $scope.topics = ['Azure', 'Office365', 'CRM Online', 'Intune'];
    $scope.init = function () {
        $timeout(function(){$('.hover.dimmer').dimmer({
            on: 'hover',
            // onShow:function(){
            //     $(e).find('.unfocus.dimmer').dimmer('hide');
            // }
        });},50)
    }
    $scope.selectTopic = function(t){
        $scope.selectedTopic = t;
    }
    $scope.isSelectedTopic = function(t){
        return $scope.selectedTopic === t;
    }
    $scope.autoScale = function(e){
        console.log(e)
    }

    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });
}