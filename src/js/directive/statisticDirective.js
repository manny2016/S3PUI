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
module.exports = function ($parse) {
    var colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
    return {
        restrict: 'E',
        templateUrl: ('public/template/statistic.html'),
        replace: true,
        scope: {
            data: "=",
            title: "@",
            comment: "@"
        },
        link: function (scope, e, a) {
            scope.color = colors[Math.round(Math.random() * colors.length)];
            scope.volume = scope.data.volume;
            if (scope.comment) {
                scope.comment = scope.data.comment;
                $($(e).find('.popup').get(0)).popup();
            }
            // scope.data = $parse(scope.data);
            console.log(scope.data)
            switch (a.type) {
                case 'joinedusers':
                    scope.volume = scope.data.objectcountthistime
                    
                    break;
                case 'regionofusers':
                    break;
                case 'influenceofusers':
                    break;
                case 'mentionedservicecount':
                    break;
                case 'mostmentionedservice':
                    break;
                case 'mostlikedservice':
                    break;
                case 'vocinsightsVol':
                    break;
                case 'vocinsightsPN':
                    break;
                case 'mostposifrom':
                    break;

            }
            // scope.labels = scope.data.labels;
        }
    }
}