module.exports = function () {
    return {
        restrict: 'E',
        templateUrl: 'public/template/platformCardContent.html?time='+new Date().getTime(),
        replace:true,
        // require:'^adminCard',
        // scope:{
        //     platform:"@"
        // },
        link: function (scope, e, a) {
            // scope.isSmall = (window.innerWidth < 1510) ? 1 : 0;
            // $(window).resize(function () {
            //     scope.$apply(function () {
            //         if (window.innerWidth < 1510) {
            //             scope.isSmall = 1;
            //         } else {
            //             scope.isSmall = 0;
            //         }
            //     });
            // });
            // scope.adminCardCtrl = adminCardCtrl;
            // $(e).find('.hover.dimmer').dimmer({
            //     on: 'hover',
            //     // onShow:function(){
            //     //     $(e).find('.unfocus.dimmer').dimmer('hide');
            //     // }
            // });
        //    scope.$on('admin-select-platform', function(evt,platform){
        //         if(platform === scope.platform){
        //             $(e).addClass('active');
        //         }else{
        //             $(e).removeClass('active');
        //         }
        //     });
        },
        // controller:function($scope){
        //     $scope.selectPlatform = function (platform) {
        //         // $scope.changedimmer(platform);
        //         $scope.adminCardCtrl.selectPlatform(platform);
        //     }
        // }
    }
}