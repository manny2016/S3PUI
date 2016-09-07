'use strict';

var app = angular.module('app.Srv', []);
app.constant('config', {
    'service': '/DataService/S3PDataService.svc/',
    'dev_service': '/data/'
});
app.factory('utilitySrv', require('./utility'));
app.factory('baseSrv', function ($http, $q, $httpParamSerializer, config) {
    return {
        get: function (api, params) {
            var path = '',
                qs = params ? "?" + $httpParamSerializer(params) : '';
            path = config.service + api + qs;
            console.log(path)
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
        },
        devGet: function (api) {
            var path = '';
            path = config.dev_service + api + '.json';

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
            return baseSrv.devGet('GetMentionedServiceList')
        },
        getCate: function () {
            return baseSrv.devGet('GetAllEnabledTopicsByPlatform');
        },
        getUser: function () {
            return baseSrv.devGet('GetTopUsers');
        },
        getSpikes: function () {
            return baseSrv.devGet('GetDailyVolSpikes');
        },
        getDistribution: function () {
            return baseSrv.devGet('GetPNDistribution');
        },
        getMentionedMostServiceList: function () {
            return baseSrv.devGet('GetMentionedMostServiceList');
        },
        getMentionedMostServiceDistribution: function () {
            return baseSrv.devGet('GetMentionedMostServiceList');
        }
    }
})

app.factory('rawdataSrv', function (baseSrv) {
    return {
        getCate: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all'; 
            return baseSrv.get('GetAllEnabledTopicsByPlatform',params);
        },
        getUser: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topNum) params.topNum = 5;
            if(!params.topic) params.topic = 'all';
            return baseSrv.get('GetTopUsers',params);
        },
        getSpikes: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topNum) params.topNum = 7;
            if(!params.topic) params.topic = 'all';
            return baseSrv.get('GetDailyVolSpikes',params);
        },
        getDistribution: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topic) params.topic = 'all';
            return baseSrv.get('GetPNDistribution',params);
        },
        getMentionedMostServiceList: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topic) params.topic = 'all';
            if(!params.PNScope) params.PNScope = 'all';
            return baseSrv.get('GetMentionedMostServiceList',params);
        },
        getMentionedMostServiceDistribution: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topic) params.topic = 'all';
            if(!params.PNScope) params.PNScope = 'all';
            return baseSrv.get('GetMentionedMostServiceList',params);
        },
        getInfluence: function (params) {
            var params = params || {};
            if(!params.platform) params.platform = 'all';
            if(!params.topic) params.topic = 'all';
            if(!params.PNScope) params.PNScope = 'all';
            if(!params.days) params.days = 7;
            return baseSrv.get('GetDailyInfluence',params);
        }

    }
})
module.exports = 'app.Srv';