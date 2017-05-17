// require('angular-websocket/dist/angular-websocket');
// var ngWebSocket = require('angular-websocket');
var app = angular.module('app.Srv', ['app.Constant', 'ngWebSocket']);
// app.constant('config', {
//     'service': '/DataService/S3PDataService.svc/',
//     'dev_service': '/data/'
// });
app.factory('utilitySrv', require('./utility'));

app.factory('baseSrv', function ($http, $q, $httpParamSerializer, CONST) {
    return {
        get: function (api, params) {
            params = params || {};
            params['cachedtimestamp'] = Math.round(new Date() / 1000);
            var path = '',
                qs = params ? "?" + $httpParamSerializer(params) : '';
            path = CONST.SERVICE_INFO.ENDPOINT + api + qs;
            var deferred = $q.defer();
            $http.get(path, {
                cache: true
            }).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else {
                    console.log(data);
                    deferred.reject(data);
                }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        },
        post: function (api, data, config) {
            var path = '';
            var config = config || {};
            path = CONST.SERVICE_INFO.ENDPOINT + api;
            var deferred = $q.defer();
            $http.post(path, data, config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else {
                    console.log(data);
                    deferred.reject(data);
                }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        },
        devGet: function (api, params) {
            var path = '',
                qs = params ? "?" + $httpParamSerializer(params) : '';

            path = CONST.SERVICE_INFO.LOCAL_TEST_DATA + api + '.json' + qs;
            var deferred = $q.defer();
            $http.get(path, {
                // cache: true
            }).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else { }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        }
    }
});

app.factory('Notifications', function (baseSrv, CONST) {
    var lastsynctime = (new Date()) / 1000 | 0;
    var collection = [];
    function listenNewDetection() {
        try {
            baseSrv.get("GetNewDetections", {
                lastsynctime: lastsynctime || 0
            }).then(function (notifications) {
                if (notifications.length > 0) {
                    $.each(notifications, function (i, notification) {
                        collection.push(notification);
                    });
                    lastsynctime = (new Date()) / 1000 | 0;
                }
            });
        }
        catch (err) { console.log('connection Error', err); }
    }
    listenNewDetection();
    var timer = setInterval(listenNewDetection, 1000 * 10);
    return {
        collection: collection,
        status: function () {
            if (timer) { return 1; }
            return 3;
        },
        reconnect: function () {
            if (timer) { clearInterval(timer); }
            timer = setInterval(listenNewDetection, 1000 * 10);
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
            return baseSrv.devGet('GetAllEnabledTopicsByPlatform', params);
        },
        getUser: function (platform, topNum, topic, PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topNum = topNum || 5;
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetTopUsers', params);
        },
        getSpikes: function (platform, topic, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.days = days || 7;
            params.topic = topic || 'all';
            return baseSrv.devGet('GetDailyVolSpikes', params);
        },
        getDistribution: function (platform, topic) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            return baseSrv.devGet('GetPNDistribution', params);
        },
        getMentionedMostServiceList: function (platform, topic, PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceList', params);
        },
        getMentionedMostServiceListByUserVol: function (platform, topic, PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceListByUserVol', params);
        },
        getMentionedMostServiceDistribution: function (platform, topic, PNScope) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            return baseSrv.devGet('GetMentionedMostServiceList', params);
        },
        getInfluence: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetDailyInfluence', params);
        },
        getVoCDetailsByDate: function (platform, topic, date, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.date = date || Math.floor(new Date().getTime() / 1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow', params);
        },
        getVoCDetailsByUser: function (platform, topic, user, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.user = user || 1234;
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow' + '.' + params.platform, params);
        },
        getVoCDetailsByPN: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow' + '.' + params.platform, params);
        },
        getVoCDetailsByServiceName: function (platform, topic, service, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.servicename = service || 'webapp';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow' + '.' + params.platform, params);
        },
        getImpactSummary: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetImpactSummary', params);
        },
        getUserVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetUserVolSpikes', params);
        },
        getMessageVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetMessageVolSpikes', params);
        },
        getInfluenceVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetInfluenceVolSpikes', params);
        },
        getUserRegionVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetUserRegionVolSpikes', params);
        },
        getKeywordsMentionedMostMapping: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('GetKeywordsMentionedMostMapping', params);
        },
        getSubPageVoCDetails: function (platform, topic, date, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.date = date || Math.floor(new Date().getTime() / 1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.devGet('subwindow' + '.' + params.platform, params);
        },
        getSubPageVoCDetailsbyKeywords: function (platform, topic, keywords, PNScope, IsFuzzyQuery, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.keywords = keywords || 'notworking';
            params.PNScope = PNScope || 'all';
            params.IsFuzzyQuery = IsFuzzyQuery || 'true';
            params.days = days || 7;
            return baseSrv.devGet('subwindow' + '.' + params.platform, params);
        },
        getSysDetections: function (forumName, msgType, topic, downloadable, bgTime, egTime) {
            var params = params || {};
            params.forumName = forumName || 'all';
            params.msgType = msgType || 'all';
            params.topic = topic || 'all';
            params.downloadable = downloadable || 'all';
            params.bgTime = bgTime || 0;
            params.egTime = egTime || 0;
            return baseSrv.devGet('GetSysDetections', params);
        },
        getPlatformSyncSetting: function (platform) {
            var params = params || {};
            params.platform = platform || 'all';
            return baseSrv.devGet('GetPlatformSyncSetting', params);
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
        getUser: function (platform, topNum, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topNum = topNum || 5;
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetTopUsers', params);
        },
        getSpikes: function (platform, topic, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.days = days || 7;
            params.topic = topic || 'all';
            return baseSrv.get('GetDailyVolSpikes', params);
        },
        getDistribution: function (platform, topic, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.days = days || 7;
            return baseSrv.get('GetPNDistribution', params);
        },
        getMentionedMostServiceList: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetMentionedMostServiceList', params);
        },
        getMentionedMostServiceListByUserVol: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetMentionedMostServiceListByUserVol', params);
        },
        getMentionedMostServiceDistribution: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetMentionedMostServiceList', params);
        },
        getInfluence: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetDailyInfluence', params);
        },
        getVoCDetailsByDate: function (platform, topic, date, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.date = date || Math.floor(new Date().getTime() / 1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByDate', params);
        },
        getVoCDetailsByUser: function (platform, topic, user, index, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.userid = user || 1234;
            params.index = (index !== undefined) ? index : -1;
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByUser', params);
        },
        getVoCDetailsByPN: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByPN', params);
        },
        getVoCDetailsByServiceName: function (platform, topic, service, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.servicename = service || 'webapp';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetVoCDetailsByServiceName', params);
        },
        getImpactSummary: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetImpactSummary', params);
        },
        getUserVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetUserVolSpikes', params);
        },
        getMessageVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetMessageVolSpikes', params);
        },
        getInfluenceVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetInfluenceVolSpikes', params);
        },
        getUserRegionVolSpikes: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetUserRegionVolSpikes', params);
        },
        getKeywordsMentionedMostMapping: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetKeywordsMentionedMostMapping', params);
        },
        getSubPageVoCDetails: function (platform, topic, date, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.Date = date || Math.floor(new Date().getTime() / 1000);
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetSubPageVoCDetails', params);
        },
        getSubPageVoCDetailsbyKeywords: function (platform, topic, keywords, PNScope, IsFuzzyQuery, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.keywords = keywords || 'notworking';
            params.PNScope = PNScope || 'all';
            params.IsFuzzyQuery = IsFuzzyQuery || 'false';
            params.days = days || 7;
            return baseSrv.get('GetSubPageVoCDetailsbyKeywords', params);
        },
        getSysDetections: function (platform, msgType, topic, downloadable, bgTime, egTime) {
            var params = params || {};
            params.platform = platform || 'all';
            params.msgType = msgType || 'all';
            params.topic = topic || 'all';
            params.downloadable = downloadable || 'all';
            params.bgTime = bgTime || 0;
            params.egTime = egTime || 0;
            return baseSrv.get('GetSysDetections', params);
        },

        //NC query
        getPlatformSyncSetting: function (platform) {
            var params = params || {};
            params.platform = platform || 'all';
            return baseSrv.get('GetPlatformSyncSetting', params);
        },
        //NC detailed page
        getVoCDetailsBySpikeDetected: function (platform, msgType, topic, timestamp) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.msgType = msgType || 'all';
            params.timestamp = timestamp || 0;
            return baseSrv.get('GetVoCDetailsBySpikeDetected', params);
        },
        getUserLanguageDistribution: function (platform, topic, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.days = days || 7;
            return baseSrv.get('GetUserLanguageDistribution', params);
        },
        getRegionDistribution: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetRegionDistribution', params);
        },
        //sentimentconversion
        getSentimentTrend: function (platform, topic, PNScope, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.PNScope = PNScope || 'all';
            params.days = days || 7;
            return baseSrv.get('GetSentimentTrend', params);
        },
        saveForumServiceSetting: function (data) {
            return baseSrv.post('SaveForumServiceSetting', data, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

        },
        getDownloadUrl: function (platform, topic, days) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.days = days || 7;
            return baseSrv.get('GetDownloadUrl', params);
        },
        getSubscribeSettings: function (platform, topic, msgtype, servicename) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.msgtype = msgtype || 'all';
            params.servicename = servicename || 'all';
            return baseSrv.get('GetSubscribeSettings', params);
        },
        createSubscribe: function (params) {
            var params = params || {};
            return baseSrv.get('CreateSubscribe', {
                "email": params.email,
                "platform": params.platform || 'all',
                "topic": params.topics.join(','),
                "msgtype": params.msgtype || 'all',
                "servicename": params.servicename || 'all'
            });
        },
        deleteSubscribe: function (id) {
            var params = params || {};
            return baseSrv.get('DeleteSubscribe', {
                "groupid": id
            });
        },
        removeSubscription: function (email) {
            return baseSrv.get('DeleteSubscribeByEmail', {
                "email": email
            });
        },
        removeSubscriptionRule: function (id) {
            return baseSrv.get('DeleteSubscribeByGroupId', {
                "groupId": id
            });
        },
        checkAdminAccessRights: function (email) {
            var params = params || {};
            params.email = email;
            return baseSrv.get('CheckAdminAccessRights', params);
        }
    }
})
module.exports = 'app.Srv';