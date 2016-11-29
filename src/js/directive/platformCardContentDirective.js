module.exports = function () {
    return {
        restrict: 'E',
        templateUrl: 'public/template/platformCardContent.html',
        replace:true,
        // require:'^adminCard',
        scope:{
            platform:"@"
        },
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
            $(e).dimmer({
                on: 'hover'
            });
        },
    }
}