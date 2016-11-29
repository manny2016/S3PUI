module.exports = function () {
    return {
        restrict: 'E',
        templateUrl: 'public/template/adminCard.html',
        replace: true,
        transclude: true,
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
            console.log(scope.CONST.APP_NAME);
            // $(e).dimmer({
            //     on: 'hover'
            // });

        },
        controller: function ($scope) {
            this.selectPlatform = $scope.selectPlatform;
        }
    }
}