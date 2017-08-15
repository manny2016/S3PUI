/*
    ==========example====================

*/
module.exports = function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/user_list.html?time='+new Date().getTime()),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "=",
            pnscope: "@",
            noPop: "@",
            days: "@"
        },
        link: function (scope, e, a) {
            scope.pnscope = scope.pnscope || 'all';
            scope.getAvatorUrl = function (user) {
                // return user.attachedobject.profile_image|| user.attachedobject.profile_image_url ||'public/images/'+scope.platform.toLowerCase()+'.png'
                return user.attachedobject.url || 'public/images/' + scope.platform.toLowerCase() + '.png'
            }
            scope.onClick = function (user, index) {
                if (a.noPop === undefined) {
                    var param = {
                        platform: scope.platform,
                        topic: scope.query.topic,
                        // userid: user.attachedobject.userId||user.attachedobject.user_id||user.attachedobject.id_str,
                        userid: user.attachedobject.userId,
                        index: index,
                        pnscope: scope.pnscope,
                        days: scope.days
                    }
                    $rootScope.popSubWin({
                        fn: 'getVoCDetailsByUser',
                        param: param
                    });
                }
            }
            scope.getData = function (location, force) {
                    if (a.location === location) {
                        console.log(scope);
                        $rootScope.service.getUser(scope.platform, 5, scope.query.topic, scope.pnscope, scope.query.granularity, scope.query.start, scope.query.end + 3600000 * 24).then(function (data) {
                            scope.users = data.slice(0, 5);
                            scope.complete = true;
                            $rootScope.$broadcast('data-got');
                        })
                    }
                }
            scope.$on('start-get-data', function (event, arg) {
                scope.complete = false;
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