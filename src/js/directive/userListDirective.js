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
            platform:"@"
        },
        link:function(scope,e,a){
            scope.onClick=function(){
                $rootScope.test();
            }
            testSrv.getUser().then(function (data) {
                // console.log(data);
                scope.users = data.slice(0, 5);
            })
            
        }
    }
}