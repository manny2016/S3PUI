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
            // console.log(scope.data)
            switch (a.type) {
                case 'joinedusers':
                    scope.volume = scope.data.objectcountthistime
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
                    scope.volume = scope.data.objectcountthistime
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
                    scope.volume = scope.data.objectcountthistime
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
                    scope.volume = scope.data.objectcountthistime
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
                    scope.style={'font-size':'30px'}; 
                    scope.labels = [
                        {
                            text: scope.data.mostlikedservice.map(function (item) {
                                return item.mentionedmostservice.attachedobject
                                    + "(" + item.occupyratio + "%)"
                            }).join(","),
                            color:"green"
                        },
                        {
                            text: scope.data.mostdislikedservice.map(function (item) {
                                return item.mentionedmostservice.attachedobject
                                    + "(" + item.occupyratio + "%)"
                            }).join(","),
                            color:"red"
                        },
                    ]
                    break;
                case 'vocinsightsVol':
                    scope.volume = scope.data.objectcountthistime.voctotalvol
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
                    scope.volume = scope.data.objectcountthistime.positivetotalvol
                        + ":"
                        + scope.data.objectcountthistime.negativetotalvol
                    scope.labels = [
                        {
                            text: 'POSI ' + label_type.spike,
                            volume: scope.data.objectcountthistime.detectedposispikesvol,
                            color: 'green'
                        }, {
                            text: 'NEG ' + label_type.spike,
                            volume: scope.data.objectcountthistime.detectednegspikesvol,
                            color: 'red'
                        }
                    ]
                    break;
                case 'mostposifrom':
                    scope.volume = scope.data.mostposifrom.vocinfluence.vocinfluencedvol
                        + ":"
                        + scope.data.mostnegfrom.vocinfluence.vocinfluencedvol
                    scope.labels = [
                        {
                            text: 'Most POSI From ' + scope.data.mostposifrom.attachedobject,
                            color: 'green'
                        }, {
                            text: 'Most NEG From  ' + scope.data.mostnegfrom.attachedobject,
                            color: 'red'
                        }
                    ]
                    break;

            }
            // scope.labels = scope.data.labels;
        }
    }
}