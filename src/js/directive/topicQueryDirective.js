module.exports = function () {
    return {
        restrict: 'EA',
        templateUrl: 'public/template/topicQuery.html',
        replace:true,
        link: function (scope, e, a) {
            scope.isSmall = (window.innerWidth < 1510) ? 1 : 0;
            $(window).resize(function () {
                scope.$apply(function () {
                    if (window.innerWidth < 1510) {
                        scope.isSmall = 1;
                    } else {
                        scope.isSmall = 0;
                    }
                });
            });
        },
    }
}