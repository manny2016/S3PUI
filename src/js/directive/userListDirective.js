/*
    ==========example====================

*/
module.exports = function () {
    return{
        restrict: 'E',
        templateUrl: ('public/template/user_list.html'),
        replace: true,
        scope: {
            users: "=",
            title : "@"
        },
        link:function(scope,e,a){
        }
    }
}