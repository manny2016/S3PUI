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
        devGet: function (api,params) {
            var path = '',
                qs = params ? "?" + $httpParamSerializer(params) : '';
            
            path = config.dev_service + api + '.json'  + qs;
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
        test: function (params) {
            return baseSrv.devGet('GetMentionedServiceList')
        },
        getCate: function (platform) {
            var params = params || {};
            params.platform = platform || 'all'; 
            return baseSrv.devGet('GetAllEnabledTopicsByPlatform',params);
        },
        getUser: function (platform,topNum,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topNum = topNum || 5;
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetTopUsers',params);
        },
        getSpikes: function (platform,topic,days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.days = days || 7;
            params.topic = topic || 'all';
            return baseSrv.devGet('GetDailyVolSpikes',params);
        },
        getDistribution: function (platform,topic) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            return baseSrv.devGet('GetPNDistribution',params);
        },
        getMentionedMostServiceList: function (platform,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceList',params);
        },
        getMentionedMostServiceListByUserVol: function(platform,topic,PNScope){
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceListByUserVol',params);
        },
        getMentionedMostServiceDistribution: function (platform,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceList',params);
        },
        getInfluence: function (platform,topic,PNScope,days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetDailyInfluence',params);
        },
        getVoCDetailsByDate:function(platform,topic,date,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.date = date || Math.floor(new Date().getTime()/1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow',params);
        },
        getVoCDetailsByUser:function(platform,topic,user,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.user = user || 1234;
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow',params);
        },
        getVoCDetailsByPN:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow',params);
        },
        getVoCDetailsByServiceName:function(platform,topic,service,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.servicename = service || 'webapp';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow',params);
        },
        getImpactSummary:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetImpactSummary',params);
        },
        getUserVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetUserVolSpikes',params);
        },
        getMessageVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetMessageVolSpikes',params);
        },
        getInfluenceVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetInfluenceVolSpikes',params);
        },
        getUserRegionVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetUserRegionVolSpikes',params);
        },
        getKeywordsMentionedMostMapping:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetKeywordsMentionedMostMapping',params);
        }
    }
})

app.factory('rawdataSrv', function (baseSrv) {
    return {
        getCate: function (platform) {
            var params = params || {};
            params.platform = platform || 'all'; 
            return baseSrv.get('GetAllEnabledTopicsByPlatform', params);
        },
        getUser: function (platform,topNum,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topNum = topNum || 5;
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.get('GetTopUsers', params);
        },
        getSpikes: function (platform,topic,days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.days = days || 7;
            params.topic = topic || 'all';
            return baseSrv.get('GetDailyVolSpikes', params);
        },
        getDistribution: function (platform,topic) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            return baseSrv.get('GetPNDistribution', params);
        },
        getMentionedMostServiceList: function (platform,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.get('GetMentionedMostServiceList', params);
        },
        getMentionedMostServiceListByUserVol: function(platform,topic,PNScope){
            var params = params || {};
            params.platform = platform || 'all'; 
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.get('GetMentionedMostServiceListByUserVol',params);
        },
        getMentionedMostServiceDistribution: function (platform,topic,PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.get('GetMentionedMostServiceList', params);
        },
        getInfluence: function (platform,topic,PNScope,days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetDailyInfluence',params);
        },
        getVoCDetailsByDate:function(platform,topic,date,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.date = date || Math.floor(new Date().getTime()/1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByDate');
        },
        getVoCDetailsByUser:function(platform,topic,user,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.user = user || 1234;
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByUser',params);
        },
        getVoCDetailsByPN:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByPN',params);
        },
        getVoCDetailsByServiceName:function(platform,topic,service,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.servicename = service || 'webapp';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByServiceName',params);
        },
        getImpactSummary:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetImpactSummary',params);
        },
        getUserVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetUserVolSpikes',params);
        },
        getMessageVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetMessageVolSpikes',params);
        },
        getInfluenceVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetInfluenceVolSpikes',params);
        },
        getUserRegionVolSpikes:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetUserRegionVolSpikes',params);
        },
        getKeywordsMentionedMostMapping:function(platform,topic,PNScope,days){
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetKeywordsMentionedMostMapping',params);
        }
    }
})
module.exports = 'app.Srv';