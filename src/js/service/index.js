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
                } else {}
            }, function (err) {
                deferred.reject(err);
            })
            return deferred.promise;
        }
    }
});

app.factory('Notifications', function ($websocket, $state, baseSrv, CONST) {
    var ws = $websocket(CONST.SERVICE_INFO.WS);
    var collection = [];
    var retried = 0;
    ws.onMessage(function (event) {
        // console.log(event);
        // console.log($state)
        collection.push(JSON.parse(event.data));
        retried = 0;
    });
    ws.onError(function (event) {
        console.log('connection Error', event);
        ws.reconnect();
        retried++;
    });

    ws.onClose(function (event) {
        console.log('connection closed', event);
        ws.reconnect();
        retried++;
    });
    return {
        collection: collection,
        status: function () {
            return ws.readyState;
        },
        reconnect: function () {
            ws.reconnect();
        },
        clearUnRead: function () {
            unReadMessage = 0;
        },
        send: function (message) {
            if (angular.isString(message)) {
                ws.send(message);
            } else if (angular.isObject(message)) {
                ws.send(JSON.stringify(message));
            }
        }

    }
});

app.factory('twitterServiceStatus', function ($websocket, $state, CONST) {
    var ws = $websocket(CONST.SERVICE_INFO.TWITTER_WS_STATUS);
    var status;
    var retried = 0;
    ws.onMessage(function (event) {
        // console.log(event);
        // console.log($state)
        status = JSON.parse(event.data);
        retried = 0;
    });
    ws.onError(function (event) {
        console.log('connection Error', event);
        ws.reconnect();
        retried++;
    });

    ws.onClose(function (event) {
        console.log('connection closed', event);
        ws.reconnect();
        retried++;
    });

    return {
        status: status
    }
})

app.factory('othersServiceStatus', function ($websocket, $state, CONST) {
    var ws = $websocket(CONST.SERVICE_INFO.OTHERS_WS_STATUS);
    var status;
    var retried = 0;
    ws.onMessage(function (event) {
        // console.log(event);
        // console.log($state)
        status = JSON.parse(event.data);
        retried = 0;
    });
    ws.onError(function (event) {
        console.log('connection Error', event);
        ws.reconnect();
        retried++;
    });

    ws.onClose(function (event) {
        console.log('connection closed', event);
        ws.reconnect();
        retried++;
    });

    return {
        status: status
    }
})
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
        getSysDetections: function (forumName, msgType, downloadable, bgTime, egTime) {
            var params = params || {};
            params.forumName = forumName || 'all';
            params.msgType = msgType || 'all';
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
        getSysDetections: function (platform, msgType, downloadable, bgTime, egTime) {
            var params = params || {};
            params.platform = platform || 'all';
            params.msgType = msgType || 'all';
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
            params.email = params.email;
            params.platform = params.platform || 'all';
            params.topic = params.topic || 'all';
            params.msgtype = params.msgtype || 'all';
            params.servicename = params.servicename || 'all';
            return baseSrv.get('CreateSubscribe', params);
        },
        deleteSubscribe: function (id) {
            var params = params || {};
            params.id = id;
            return baseSrv.get('DeleteSubscribe', params);
        },
        checkAdminAccessRights: function (email) {
            var params = params || {};
            params.email = email;
            return baseSrv.get('CheckAdminAccessRights', params);
        }
    }
})
module.exports = 'app.Srv';