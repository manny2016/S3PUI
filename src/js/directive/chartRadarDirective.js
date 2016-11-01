/*
======================
example pie 
======================
$scope.config = {
        type: 'pie',
        series: [{
            data: [{
                value: 1024,
                name: 'POSI',
                itemStyle: {
                    normal: {
                        color: '#91c7ae'
                    }
                }
            }, {
                    value: 233,
                    name: 'NEG'
                }]
        }],
        title: {
            text: "hello world"
        }
    }


==========================
example axis
==========================
$scope.config={
        series:[{
            name: 'Vol',
            type: 'bar',
            data:[1,2,3,4,5]
        }],
        title:{
            text:"hello world"
        }
    } 

===========================
example connect
==========================
$scope.config={
 group:"chart-group",
 .....
 }
 echarts.connect('chart-group');

 **********************
 discarded above
 **********************

 @parameters:
    platform string
        all,twitter,so,sf,su,msdn,tn
    topic string
        all,azure,...
    pnscope string
        all,posi,neg
    days number
        7,14
    

*/

module.exports = /*@ngInject*/ function ($rootScope, $filter, $q, $location, $compile, utilitySrv) {
    return {
        restrict: 'E',
        templateUrl: 'public/template/radarchart.html',
        replace: true,
        scope: {
            title: "@",
            platform: "@",
            query: "="
        },
        link: function (scope, element, attrs) {
            var _ = scope;
            var echartDom = $(element).find("div.echart");
            _.service = $rootScope.service;
            _.complete = false;
            _.query = _.query || {};
            _.chartOpt = initRadarChartOpt(_);
            _.chartObj = echarts.init(echartDom[0], 'macarons');
            _.getData = function (location) {
                // console.log(attrs.location, location)
                if (attrs.location === location) {
                    _.complete = false;
                    var apiFn = _.service['getImpactSummary'];
                    var fnPromise = apiFn(_.platform, _.query.topic);
                    customRadarData(fnPromise, _).then(function (config) {
                        _.chartOpt = angular.merge(_.chartOpt, config);
                        initChart(_.chartObj, _.chartOpt, _.group);
                        afterInit($rootScope, _, _.chartObj);
                    })
                }
            }
            _.$on('start-get-data', function (event, arg) {
                _.complete = false;
                _.getData(arg);
            });
            _.clientWidth = element[0].clientWidth;
            _.$watch("clientWidth", function (newV, oldV) {
                if (newV !== oldV) {
                    echarts.getInstanceByDom(echartDom.get(0)).resize();
                }
            })
            $(window).resize(function () {
                _.$apply(function () {
                    _.clientWidth = element[0].clientWidth;
                });
            });
        },
    }
}
function initChart(echartObj, chartOpt) {
    setTimeout(function () {
        echartObj.resize();
        echartObj.setOption(chartOpt);
    }, 100)

}
function afterInit(rootscope, scope, echartObj) {
    scope.complete = true;
    setTimeout(function () {
        echartObj.resize();
    }, 150)
    rootscope.$broadcast('data-got', echartObj);
}

function customRadarData(fnPromise, scope) {
    var dataSeries = function (raw) {
        var joinedusers = raw.joinedusers.comparedratio,
            influenceofusers = raw.influenceofusers.comparedratio,
            mentionedservicecount = raw.mentionedservicecount.comparedratio,
            mostpost = raw.vocinsights.comparedratio,
            positivepost = (raw.vocinsights.objectcountthistime.positivetotalvol - raw.vocinsights.objectcountlasttime.positivetotalvol) / raw.vocinsights.objectcountlasttime.positivetotalvol,
            negativepost = (raw.vocinsights.objectcountthistime.negativetotalvol - raw.vocinsights.objectcountlasttime.negativetotalvol) / raw.vocinsights.objectcountlasttime.negativetotalvol;
        var dataArray = [
            1 + joinedusers,
            1 + influenceofusers,
            1 + mentionedservicecount,
            1 + mostpost,
            1 + positivepost,
            1 + negativepost
        ];
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > 2) dataArray[i] = 2;
            if (dataArray[i] < 0) dataArray[i] = 0;
        }
        return {
            series: [{
                type: 'radar',
                data: [
                    {
                        value: dataArray,
                        name: scope.platform + ' - Status'
                    }
                ]
            }],
            title: {
                text: scope.title || ''
            }
        }
    }
    var fn = dataSeries;
    return fnPromise.then(function (data) {
        return fn(data);
    })
}

function initRadarChartOpt(scope) {
    var opt = {
        tooltip: {},
        radar: {
            // shape: 'circle',
            indicator: [
                { name: 'User Joined Discussion', max: 2 },
                { name: 'Service Mentioned', max: 2 },
                { name: 'Influence Impact', max: 2 },
                { name: 'Message Post', max: 2 },
                { name: 'Postive Post', max: 2 },
                { name: 'Negative Post', max: 2 }
            ]
        }
    };

    return opt;
}