/*
    ==========example====================

    $scope.statistic = {
        title:'Users Joined Discussion',
        volume:3424,
        comment:'Page Views - POST : NEG',
        labels:[{
            append:1,
            color:'red',
            icon:1,
            text:12
        },{
            append:0,
            color:'green',
            icon:0,
            text:13
        }]
    }

*/
module.exports = function () {
    var colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black'];
    return{
        restrict: 'E',
        templateUrl: ('public/template/statistic.html'),
        replace: true,
        scope: {
            data: "="
        },
        link:function(scope,e,a){
            scope.color = colors[Math.round(Math.random()*colors.length)];
            scope.title = scope.data.title;
            scope.volume = scope.data.volume;
            if(scope.data.comment){
                scope.comment = scope.data.comment;
                $($(e).find('.popup').get(0)).popup();
            }
            scope.labels = scope.data.labels;
        }
    }
}