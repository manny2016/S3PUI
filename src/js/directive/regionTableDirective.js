/*
    ==========example====================

*/
module.exports = /*@ngInject*/function ($rootScope, $compile) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/region_table.html?time='+new Date().getTime()),
        replace: true,
        scope: {
            // users: "=",
            platform: "@",
            query: "=",
            association: "@"
        },
        link: function (scope, e, a) {
            $rootScope.$on('set-region-table-data', function (evt, arg) {
                if (scope.association === arg.association) {
                    scope.total = arg.total;
                    scope.data = arg.data
                }
            });
            scope.swithside = function () {
                $(e).parent().parent().parent().shape('flip up')
            }
            scope.getters = {
                twitterInf: function (value) {
                    return value.user.followers_count + value.user.friends_count;
                }
            }
        }
    }
}
