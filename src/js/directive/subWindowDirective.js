/*
    ==========example====================

*/
module.exports = function ($rootScope,testSrv) {
    return{
        restrict: 'E',
        templateUrl: ('public/template/sub_window.html'),
        replace: true,
        scope: {
            // users: "=",
            title : "@",
<<<<<<< HEAD
            platform: "@",
            query:"="
        },
        link:function(scope,e,a){
            testSrv.getSubWindow().then(function(data){
                scope.raw = data;
                scope.topUsers = data.topusers
            })
        }
    }
}

function initHourlyChartData(raw) {

=======
            platform:"@"
        },
        link:function(scope,e,a){
            testSrv.getSubWindow().then(function(data){
                console.log(data)
            })
        }
    }
>>>>>>> c5d05752acb205d953c25bb6d2c951497b0229c9
}