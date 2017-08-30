module.exports = function (CONST) {
    return {
        restrict: 'E',
        templateUrl: 'public/template/scopeCardContent.html?time='+new Date().getTime(),
        replace: true,
        transclude:true,
        // scope: {
        //     data: "=",
        //     platforms: "="
        // },
        link: function (scope, e, a ,adminCardCtrl) {
            scope.CONST = CONST;
            (scope.init = function () {
                scope.twitterKeywords = [];
                scope.sotags = [], scope.sutags = [], scope.sftags = [];
                scope.msdncategorys = [],
                    scope.tncategorys = [];
            })();
            scope.decline = function(){
                scope.init();
            }
        },
        // controller:function($scope){
        // $scope.CONST = CONST;
        // $scope.selectPlatform = function (platform) {
        //     // $scope.changedimmer(platform); 
        //     $scope.adminCardCtrl.selectPlatform(platform);
        // }
        // }
    }
}