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
            // console.log(scope.$parent.label); 
            scope.label = scope.$parent.label || {};
            scope.icon = icon_type[scope.label.icon] || null;
            scope.append = label_type[scope.label.append] || "";
            scope.color = scope.label.color || "black";
            scope.text = scope.label.text;
        }
    }
}
