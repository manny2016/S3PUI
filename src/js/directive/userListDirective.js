/*
    ==========example====================

*/
module.exports = function ($rootScope, testSrv) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/user_list.html'),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "=",
            noPop: "@"
        },
        link: function (scope, e, a) {
            scope.onClick = function () {
                if (a.noPop === undefined) {
                    $rootScope.test();
                }
            }
            scope.getData = function (location) {
                if (location == 'home') {
                    testSrv.getUser(scope.platform, 5, scope.query.topic).then(function (data) {
                        console.log(data);
                        scope.users = data.slice(0, 5);
                        scope.complete = true;
                    })
                }
            }
            scope.$on('start-get-data', function (event, arg) {
                scope.getData(arg);
            });

            scope.$on('set-user-data', function (event, arg) {
                if (a.location == 'sub') {
                    scope.users = arg;
                    scope.complete = true;
                }
            });

        }
    }
}