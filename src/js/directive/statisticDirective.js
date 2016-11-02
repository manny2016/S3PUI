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
var label_type = {
    compared: 'Compared with Last Week',
    spike: 'Vol Spike Detected (hourly)',
    string: ''
};
module.exports = function ($parse, $filter) {
    var colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
    return {
        restrict: 'E',
        templateUrl: ('public/template/statistic.html'),
        replace: true,
        scope: {
            data: "=",
            title: "@",
            comment: "@",
            color:"@"
        },
        link: function (scope, e, a) {
            var numberFormat = $filter('thousandsuffix');
            var percentage = $filter('percentage');
            // scope.color = colors[Math.round(Math.random() * colors.length)];
            scope.volume = scope.data.volume;
            if (scope.comment) {
                scope.comment = scope.data.comment;
                $($(e).find('.popup').get(0)).popup();
            }
            // scope.data = $parse(scope.data);
            // console.log(scope.data)
            switch (a.type) {
                case 'joinedusers':
                    scope.volume = numberFormat(scope.data.objectcountthistime)
                    scope.labels = [
                        {
                            text: label_type.compared,
                            volume: scope.data.comparedratio,
                            type: 'ratio',
                            isCompared: true
                        }, {
                            text: label_type.spike,
                            volume: scope.data.detectedhourlyspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'regionofusers':
                    scope.volume = numberFormat(scope.data.objectcountthistime)
                    scope.volume = scope.volume===0?"No Data Available":scope.volume;
                    scope.labels = [
                        {
                            text: label_type.compared,
                            volume: scope.data.comparedratio,
                            type: 'ratio',
                            isCompared: true
                        }, {
                            text: label_type.spike,
                            volume: scope.data.detectedhourlyspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'influenceofusers':
                    scope.volume = numberFormat(scope.data.objectcountthistime)
                    scope.labels = [
                        {
                            text: label_type.compared,
                            volume: scope.data.comparedratio,
                            type: 'ratio',
                            isCompared: true
                        }, {
                            text: label_type.spike,
                            volume: scope.data.detectedhourlyspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'mentionedservicecount':
                    scope.volume = numberFormat(scope.data.objectcountthistime)
                    scope.labels = [
                        {
                            text: label_type.compared,
                            volume: scope.data.comparedratio,
                            type: 'ratio',
                            isCompared: true
                        }, {
                            text: label_type.spike,
                            volume: scope.data.detectedhourlyspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'mostmentionedservice':
                    scope.volume = scope.data[0].mentionedmostservice.attachedobject
                    var tmp = scope.data.map(function (item) {
                        return item.mentionedmostservice.attachedobject
                            + "(" + item.occupyratio + "%)"
                    })
                    scope.labels = [
                        {
                            text: tmp.join(",")
                        }
                    ]
                    break;
                case 'mostlikedservice':
                    scope.volume = scope.data.mostlikedservice[0].mentionedmostservice.attachedobject
                        + ":"
                        + scope.data.mostdislikedservice[0].mentionedmostservice.attachedobject
                    scope.style = { 'font-size': '26px' };
                    scope.labels = [
                        {
                            text: scope.data.mostlikedservice.map(function (item) {
                                return item.mentionedmostservice.attachedobject
                                    + "(" + item.occupyratio + "%)"
                            }).join(","),
                            color: "green"
                        },
                        {
                            text: scope.data.mostdislikedservice.map(function (item) {
                                return item.mentionedmostservice.attachedobject
                                    + "(" + item.occupyratio + "%)"
                            }).join(","),
                            color: "red"
                        },
                    ]
                    break;
                case 'vocinsightsVol':
                    scope.volume = numberFormat(scope.data.objectcountthistime.voctotalvol)
                    scope.labels = [
                        {
                            text: label_type.compared,
                            volume: scope.data.comparedratio,
                            type: 'ratio',
                            isCompared: true
                        }, {
                            text: label_type.spike,
                            volume: scope.data.detectedhourlyspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'vocinsightsPN':
                    var originBoj = scope.data.objectcountthistime;
                    scope.volume = [
                        numberFormat(originBoj.positivetotalvol,0),
                        numberFormat(originBoj.negativetotalvol,0),
                        numberFormat(originBoj.neutraltotalvol,0)
                    ];
                    // scope.subVolume = [
                    //     percentage(originBoj.positivetotalvol / originBoj.voctotalvol, 0),
                    //     percentage(originBoj.negativetotalvol / originBoj.voctotalvol, 0),
                    //     percentage(originBoj.positivetotalvol / originBoj.voctotalvol, 0)
                    // ];
                    scope.subVolume = [
                        originBoj.positivetotalvol / originBoj.voctotalvol,
                        originBoj.negativetotalvol / originBoj.voctotalvol,
                        originBoj.neutraltotalvol / originBoj.voctotalvol
                    ];
                    // scope.volume = numberFormat(originBoj.positivetotalvol)
                    //     + "(" + percentage(originBoj.positivetotalvol / originBoj.voctotalvol, 0) + ")"
                    //     + ":"
                    //     + numberFormat(originBoj.negativetotalvol)
                    //     + "(" + percentage(originBoj.negativetotalvol / originBoj.voctotalvol, 0) + ")"
                    //     + ":"
                    //     + numberFormat(originBoj.neutraltotalvol)
                    //     + "(" + percentage(originBoj.positivetotalvol / originBoj.voctotalvol, 0) + ")";
                    // scope.volume += percentage(originBoj.neutraltotalvol/originBoj.voctotalvol,0)
                    //     + ":"
                    //     + percentage(originBoj.negativetotalvol/originBoj.voctotalvol,0)
                    //     + ":"
                    //     + percentage(originBoj.neutraltotalvol/originBoj.voctotalvol,0)
                    scope.labels = [
                        {
                            text: 'POS ' + label_type.spike,
                            volume: originBoj.detectedposispikesvol,
                            color: 'green'
                        }, {
                            text: 'NEG ' + label_type.spike,
                            volume: originBoj.detectednegspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'mostposifrom':
                    // scope.volume = numberFormat(scope.data.mostposifrom.vocinfluence.vocinfluencedvol)
                    //     + ":"
                    //     + numberFormat(scope.data.mostnegfrom.vocinfluence.vocinfluencedvol)
                    var originBoj = scope.data.objectcountthistime;
                    scope.volume = [
                        numberFormat(originBoj.positiveinfluencedvol,0),
                        numberFormat(originBoj.negativeinfluencedvol,0)
                    ];
                    scope.subVolume = [
                        originBoj.positiveinfluencedvol / originBoj.vocinfluencedvol,
                        originBoj.negativeinfluencedvol / originBoj.vocinfluencedvol
                    ];
                    scope.labels = [
                        // {
                        //     text: 'Most POS From ' + scope.data.mostposifrom.attachedobject,
                        //     color: 'green'
                        // }, {
                        //     text: 'Most NEG From  ' + scope.data.mostnegfrom.attachedobject,
                        //     color: 'red'
                        // }
                    ]
                    break;

            }
            scope.isVolObj = function(){
                return angular.isArray(scope.volume) || angular.isObject(scope.volume)
            }
            // scope.labels = scope.data.labels;
        }
    }
}