/*
    ==========example====================

*/
module.exports = function ($rootScope,testSrv) {
    return{
        restrict: 'E',
        templateUrl: ('public/template/user_list.html'),
        replace: true,
        scope: {
            // users: "=",
            title : "@",
            platform: "@",
            query: "=",
            noPop: "@"
        },
        link: function (scope, e, a) {
            console.log(scope)
            scope.onClick = function () {
                console.log(scope.noPop);
                console.log(a);
                $rootScope.test();
            }
            scope.getData = function (location) {
                if (a.location === location) {
                    testSrv.getUser(scope.platform, 5, scope.query.topic).then(function (data) {
                        // console.log(data);
                        scope.users = data.slice(0, 5);
                    })
                }
            }
            scope.$on('start-get-data', function (event, arg) {
                scope.getData(arg);
            });
            
        }
    }
}