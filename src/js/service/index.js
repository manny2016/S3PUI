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
                    deferred.reject(data);
                }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        },
        get2: function (api, params) {
            params = params || {};
            params['cachedtimestamp'] = Math.round(new Date() / 1000);
            var path = '',
                qs = params ? "?" + $httpParamSerializer(params) : '';
            path = CONST.SERVICE_INFO.ENDPOINT2 + api + qs;
            var deferred = $q.defer();
            $http.get(path, {
                cache: true
            }).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else {
                    deferred.reject(data);
                }
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        },
        post2: function (api, data, config) {
            var path = '';
            var config = config || {};
            path = CONST.SERVICE_INFO.ENDPOINT2 + api;
            var deferred = $q.defer();
            $http.post(path, data, config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data)
                } else {
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
    var timer = setInterval(listenNewDetection, 1000 * 60);
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

app.factory('rawdataSrv', function (baseSrv, CONST) {
    function setDateTimeRange(p, s) {
        if (s) {
            var granularity = s.granularity || 3;
            var start = s.start / 1000;
            var end = (s.end + (granularity == 2 ? 3600000 : 3600000 * 24)) / 1000;
            p = p || {};
            p.fromcycle = granularity;
            p.start = start;
            p.end = end;
        }
    }
    function httpGet(topic, api, params) {
        if (CONST.TOPICS_V3.indexOf(topic) >= 0) {
            return baseSrv.get2(api, params);
        } else {
            return baseSrv.get(api, params);
        }
    }
    function httpPost(topic, api, data, config) {
        if (CONST.TOPICS_V3.indexOf(topic) >= 0) {
            return baseSrv.post2(api, data, config);
        } else {
            return baseSrv.post(api, data, config);
        }
    }
    return {
        getCate: function (platform) {
            var params = params || {};
            params.platform = platform || 'all';
            return baseSrv.get2('GetAllEnabledTopicsByPlatform', params);
        },
        getUser: function (platform, topNum, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topNum = topNum || 5;
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetTopUsers', params);
        },
        getSpikes: function (platform, topic, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetDailyVolSpikes', params);
        },
        getDistribution: function (platform, topic, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetPNDistribution', params);
        },
        getInfluence: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetDailyInfluence', params);
        },
        getMentionedMostServiceList: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetMentionedMostServiceList', params);
        },
        getMentionedMostServiceListByUserVol: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetMentionedMostServiceListByUserVol', params);
        },
        getMentionedMostServiceDistribution: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetMentionedMostServiceList', params);
        },
        getVoCDetailsByDate: function (platform, topic, PNScope, date, granularity) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            params.date = date || Math.floor(new Date().getTime() / 1000);
            params.fromcycle = granularity || 3;
            return httpGet(topic, 'GetVoCDetailsByDate', params);
        },
        getVoCDetailsByPN: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetVoCDetailsByPN', params);
        },
        getVoCDetailsByServiceName: function (platform, topic, service, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.servicename = service || 'webapp';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetVoCDetailsByServiceName', params);
        },
        getVoCDetailsByUser: function (platform, topic, user, index, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.userid = user || 1234;
            params.index = (index !== undefined) ? index : -1;
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetVoCDetailsByUser', params);
        },
        getImpactSummary: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetImpactSummary', params);
        },
        getUserVolSpikes: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetUserVolSpikes', params);
        },
        getMessageVolSpikes: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetMessageVolSpikes', params);
        },
        getInfluenceVolSpikes: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetInfluenceVolSpikes', params);
        },
        getUserRegionVolSpikes: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetUserRegionVolSpikes', params);
        },
        getKeywordsMentionedMostMapping: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetKeywordsMentionedMostMapping', params);
        },
        getSubPageVoCDetails: function (platform, topic, PNScope, date, granularity) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, {
                granularity: granularity,
                start: date * 1000,
                end: date * 1000
            });
            return httpGet(topic, 'GetSubPageVoCDetails', params);
        },
        getSubPageVoCDetailsbyKeywords: function (platform, topic, keywords, PNScope, IsFuzzyQuery, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'all';
            params.keywords = keywords || 'notworking';
            params.PNScope = PNScope || 'all';
            params.IsFuzzyQuery = IsFuzzyQuery || 'false';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetSubPageVoCDetailsbyKeywords', params);
        },
        getSysDetections: function (platform, msgType, topic, downloadable, bgTime, egTime) {
            var params = params || {};
            params.platform = platform || 'all';
            params.msgType = msgType || 'all';
            params.topic = topic || 'all';
            params.downloadable = downloadable || 'all';
            params.bgTime = bgTime || 0;
            params.egTime = egTime || 0;
            return httpGet(topic, 'GetSysDetections', params);
        },

        //NC query
        getPlatformSyncSetting: function (platform) {
            var params = params || {};
            params.platform = platform || 'all';
            return baseSrv.get('GetPlatformSyncSetting', params);
        },
        //NC detailed page
        getVoCDetailsBySpikeDetected: function (platform, msgType, topic, datetime) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.msgType = msgType || 'all';
            params.datetime = datetime || 0;
            return httpGet(topic, 'GetVoCDetailsBySpikeDetected', params);
        },
        getRegionDistribution: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetRegionDistribution', params);
        },
        //sentimentconversion
        getSentimentTrend: function (platform, topic, PNScope, source) {
            var params = params || {};
            params.platform = platform || 'twitter';
            params.topic = topic || 'azure';
            params.PNScope = PNScope || 'all';
            setDateTimeRange(params, source);
            return httpGet(topic, 'GetSentimentTrend', params);
        },
        saveForumServiceSetting: function (data) {
            return baseSrv.post('SaveForumServiceSetting', data, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        },
        getSubscribeSettings: function (platform, topic, msgtype, servicename) {
            var params = params || {};
            params.platform = platform || 'all';
            params.topic = topic || 'all';
            params.msgtype = msgtype || 'all';
            params.servicename = servicename || 'all';
            return httpGet(topic, 'GetSubscribeSettings', params);
        },
        createSubscribe: function (params) {
            var params = params || {};
            return baseSrv.post('CreateSubscribe', {
                groupid: params.id,
                email: params.email,
                subscription: {
                    platforms: [params.platform || 'all'],
                    topics: params.topics,
                    messagetypes: [params.msgtype || 'all']
                }
            }, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
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