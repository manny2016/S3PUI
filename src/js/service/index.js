'use strict';

var app = angular.module('app.Srv', []);
app.constant('config', {
    'service': '/DataService/S3PDataService.svc/',
    'dev_service': '/data/'
});
app.factory('utilitySrv',require('./utility'));
app.factory('baseSrv', function ($http, $q, config) {
    return {
        get: function (api, dev) {
            var path = '',
                dev = dev || false;
            if (dev) {
                path = config.dev_service + api + '.json'
            } else {
                path = config.service + api
            }
            var deferred = $q.defer();
            $http.get(path).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else {
                }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        }
    }
});

app.factory('testSrv', function (baseSrv) {
    return {
        test: function () {
            return baseSrv.get('GetMentionedServiceList', true)
        },
        getCate:function(){
            return baseSrv.get('GetAllEnabledTopicsByPlatform',true);
        },
        getUser:function(){
            return baseSrv.get('GetTopUsers',true);
        },
        getSpikes:function(platform){
            platform = platform || 'all';
            // console.log(platform)
            return baseSrv.get('GetDailyVolSpikes',true);
        },
        getDistribution:function(){
            return baseSrv.get('GetPNDistribution',true);
        },
        getMentionedMostServiceList:function(){
            return baseSrv.get('GetMentionedMostServiceList',true);
        },
        getMentionedMostServiceDistribution:function(){
            return baseSrv.get('GetMentionedMostServiceList',true);
        }
    }
})

app.factory('rawdataSrv',function(baseSrv){
    return{
        getCate:function(){
            return baseSrv.get('GetAllEnabledTopicsByPlatform');
        },
        getUser:function(){
            return baseSrv.get('GetTopUsers');
        },
        getSpikes:function(platform){
            platform = platform || 'all';
            // console.log(platform)
            return baseSrv.get('GetDailyVolSpikes');
        },
        getDistribution:function(){
            return baseSrv.get('GetPNDistribution');
        },
        getMentionedMostServiceList:function(){
            return baseSrv.get('GetMentionedMostServiceList');
        },
        getMentionedMostServiceDistribution:function(){
            return baseSrv.get('GetMentionedMostServiceList');
        },
        getInfluence:function(){
            return baseSrv.get('GetDailyInfluence');
        }

    }
})
module.exports = 'app.Srv';