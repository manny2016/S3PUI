/*
    ==========example====================

*/
module.exports = function (testSrv) {
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
            console.log(scope.platform);
            testSrv.getUser().then(function (data) {
                // console.log(data);
                scope.users = data.slice(0, 5);
            })
            
        }
    }
}