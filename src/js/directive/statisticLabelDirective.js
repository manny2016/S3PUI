/*
    =======example========
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
*/
module.exports = function () {
    var label_type = ['Compared with Last Week',
        'Vol Spike Detected (hourly)',
        ''
    ];
    var icon_type = [
        'long arrow up',
        'long arrow down'
    ]
    return {
        restrict: 'E',
        templateUrl: ('public/template/statistic_label.html'),
        replace: true,
        scope: {},
        link: function (scope, e, a) {
            scope.label = scope.$parent.label || {};
            scope.style = scope.label.style || "";
            scope.volume = !isNaN(Number(scope.label.volume))?Number(scope.label.volume):null;
            scope.text = scope.label.text || "";
            scope.color = scope.label.color || "black";
            scope.type = scope.label.type || "";
            scope.isCompared = scope.label.isCompared || "";
            scope.getColor = function(){
                return (scope.volume===null)?scope.color:'';
            }
        }
    }
}
