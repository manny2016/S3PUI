/*
    ==========example====================

*/
module.exports = function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: ('public/template/user_list.html'),
        replace: true,
        scope: {
            // users: "=",
            title: "@",
            platform: "@",
            query: "=",
            pnscope: "@",
            noPop: "@"
        },
        link: function (scope, e, a) {
            scope.pnscope = scope.pnscope || 'all';
            console.log(scope.platform);
            scope.getAvatorUrl = function(user){
                return user.attachedobject.profile_image|| user.attachedobject.profile_image_url ||'public/images/'+scope.platform.toLowerCase()+'.png'
            }
            scope.onClick = function (user) {
                if (a.noPop === undefined) {
                    var param = {
                        platform: scope.platform,
                        topic: scope.query.topic,
                        userid: user.attachedobject.userId||user.attachedobject.user_id||user.attachedobject.id_str,
                        pnscope: scope.pnscope 
                    }
                    $rootScope.popSubWin({
                        fn: 'getVoCDetailsByUser',
                        param: param
                    });
                }
            }
            scope.getData = function (location, force) {
                if (a.location === location) {
                    $rootScope.service.getUser(scope.platform, 5, scope.query.topic, scope.pnscope).then(function (data) {
                        scope.users = data.slice(0, 5);
                        // console.log(scope.users)
                        scope.complete = true;
                        $rootScope.$broadcast('data-got');
                    })
                }
            }
            // scope.getData('', true);
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